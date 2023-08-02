import {GSheetValueRangesResponse} from './getGServices';
import {splitAt, tail, uniq} from 'ramda';
import {sortStatusIds, StoneStatus} from 'iso/src/store/bootstrap/StatusesMatrix';
import {RoleVO} from 'iso/src/store/bootstrap/settingsDuck';

export type SettingsCell<R> = {
    title?: string
    value?: R
    columnIndex: number
    restIndex?: number
}

export type PropsAndRest<SKey extends string, NKey extends SKey = undefined, R = string> = [{
    [key in keyof Omit<{ [key in SKey]: any }, NKey>]: string

} & {
    [key in NKey]: number
}, SettingsCell<R>[]]

const getBooleanValue = value => {
    if(value === 1 || value ==='1')
        return true
    else if(value === 0|| value ==='0')
        return false
    else throw new Error(`Cell value should be equals 0 or 1, actual value "${value}"`)
}

const isBooleanCellValue = (value) =>
    value === 1 || value === 0 || value ==='1' || value ==='0'

const isFalse = value => !getBooleanValue(value)
const mapGSheetValueRangeToPropsAndRest = <K extends string, N extends K, R = any>(values: any[][], props: K[] = [], numbers: N[] = []) => {
    const columnTitles = values[0]
    return tail(values).map((row: Array<string>): PropsAndRest<K, N, R> => {
        const obj = {}

        const rest: SettingsCell<R>[] = []
        row.forEach((cell, columnIndex) => {
            if (columnIndex < props.length) {
                const prop = props[columnIndex]
                if(prop !== undefined) {
                    obj[prop] = cell === undefined
                        ? undefined
                        : numbers.includes(prop as any as N) ? Number(cell) : String(cell)
                }
            } else {
                rest.push({
                    columnIndex,
                    restIndex: columnIndex - props.length,
                    title: columnTitles[columnIndex],
                    value: (isBooleanCellValue(cell)) ? getBooleanValue(cell) : cell
                })
            }


        })
        return [obj as any, rest]
    })
}

export const parseGsheetRanges = (response: GSheetValueRangesResponse) => {

    const [titleRange, rolesRange, usersRange,projectsRange, statusesBlocksRange, statusesWindowsRange, ] = response

    const projects: ProjectInfo[] = mapGSheetValueRangeToPropsAndRest(
        projectsRange.values,
        ['projectId', 'name','projectStatusesType', 'analyticsGroup','analyticsName','modelUrl', 'stonesUrl', ],

    ).map(([p, rest]) => ({...p,
        modelUrl: p.modelUrl.startsWith('http')
            ? p.modelUrl
            : ('https://stroy-monitoring.ru'+p.modelUrl),

        stonesUrl: p.stonesUrl.startsWith('http')
            ? p.stonesUrl
            : ('https://stroy-monitoring.ru'+p.stonesUrl),
    })) as any

    const roles: RoleVO[] = mapGSheetValueRangeToPropsAndRest(
        rolesRange.values,
        ['roleId', 'name', 'description'],
        ['roleId']
    ).map(([s, rest]) => ({...s, destinationStatusesIds: [], sourceStatusesIds: [], layers:[]}))

    const userProps =   ['userId', 'email', 'password', 'firstName', 'lastName', 'company', 'title']
    const [other, projectIds] = splitAt(userProps.length + roles.length+1, usersRange.values[0])
    const users: UserVO[] = mapGSheetValueRangeToPropsAndRest(
        usersRange.values,
        userProps,
    ).map(([s, rest]) => {
        const [roleMarks, projectAndStatMarks] = splitAt(roles.length, rest)
        const [statMarks, projectMarks] =  splitAt(1, projectAndStatMarks)
      //  console.log('roleMarks',roleMarks)
        const roleIds =roleMarks.filter(c => c.value).map(c => roles.find(r => r.name === c.title).role)
        const user = {

            ...s, rest,
            userId: String(s.userId),
            roleIds,
            statistics: statMarks[0] && statMarks[0].value,
            projectIds: projectIds.filter(
                (id, i) => projectMarks[i] && projectMarks[i].value)
        }
        return user;
    })


    const parseStatuses = (statusesRange, statusType = 'blocks') => {
        const rolesRowsLength = statusesRange.values.findIndex((row, index) => {
            if(index> 1 && !!row[1])
                return true
            return false
        })
                let [aclTable, statusesRows] = splitAt(rolesRowsLength, statusesRange.values)
                const [aclHeader, ...aclRows] = aclTable.map(r => {
                    var [pref,aclRow] = splitAt(6, r)
                    return aclRow
                })

                const  statuses: StoneStatus[] = statusesRows.map(
                    (row: any[]) => {
                        const [newStatusId, statusId, color, name,description, includesRaw, ...rest] = row
                        return {
                            statusType,
                            color,
                            description,
                            includesRaw,
                            name,
                            statusId: Number(statusId),
                            includedStatusIds: (includesRaw||'').split(';').filter(s => !!s).map(s => Number(s)),
                            nextStatusesIds: [],
                            prevStatusesIds: []
                        }
                     }
                )

                const getStatusByName = (name: string) => statuses.find(s => s.name === name)
                const getRoleByName = (name: string) => roles.find(s => s.name === name)
                statusesRows.forEach((row: any[]) => {
                    const [nextStatusId, statusId, color, name, description, includesRaw, ...rest] = row
                    const prevStatus = getStatusByName(name)
                    rest.forEach((value, index) => {
                        if(getBooleanValue(value)) {
                            const nextName = aclHeader[index]

                            const nextStatus = getStatusByName(nextName)
                          //  console.log('parse status switch', name, prevStatus, nextName, nextStatus)
                            nextStatus.prevStatusesIds.push(prevStatus.statusId)
                            prevStatus.nextStatusesIds.push(nextStatus.statusId)
                        }
                    })
                })

                aclRows.forEach((row, index) => {
                    const name = aclTable[index+1][0]
                    const rest = row
                    const role = getRoleByName(name)
                    role.layers.push(statusType)
                    rest.forEach( (value, index) => {
                        const statusName = aclHeader[index]
                        const status = getStatusByName(statusName)
                        if(getBooleanValue(value)) {
                            role.destinationStatusesIds.push(status.statusId)
                            role.sourceStatusesIds= uniq([...role.sourceStatusesIds,...status.prevStatusesIds])
                        }
                    })
                })

        statuses.forEach(s =>{ s.prevStatusesIds  = sortStatusIds(s.prevStatusesIds)
            s.nextStatusesIds  = sortStatusIds(s.nextStatusesIds)}
        )


            return statuses
        }
        const statuses =[...parseStatuses(statusesBlocksRange,'blocks'), ...parseStatuses(statusesWindowsRange,'windows')]
    projects.forEach(p => {
        if(!p.analyticsName) {
            p.analyticsName = p.name
        }
    })




    roles.forEach(r => {
        r.destinationStatusesIds = sortStatusIds(r.destinationStatusesIds)
        r.sourceStatusesIds =  sortStatusIds(r.sourceStatusesIds)
    })





    return {
        projects: projects.filter(p => p!==undefined && p.projectId),
        users: users.filter(p => p!==undefined && p.userId),
        roles,
        statuses,

    }
}