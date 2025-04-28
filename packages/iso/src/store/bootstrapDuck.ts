import * as fsa from '@sha/fsa'
import {combineReducers} from 'redux'
import {
    EXPENSES,
    LIST_WORK_TYPES,
    NOTIFICATIONS,
    TASKS
} from './bootstrap';
import configDuck from './bootstrap/configDuck'
import settingsDuck from './bootstrap/settingsDuck'
import {ISOState} from '../ISOState'
import {default as USERS, UserVO} from './bootstrap/repos/users'
import {SITES, SiteVO} from './bootstrap/repos/sites'
import {CONTRACTS, ContractVO} from './bootstrap/repos/contracts'
import {ISSUES, IssueVO} from './bootstrap/repos/issues'
import {isCRUD} from '@sha/fsa/src/createCRUDDuck'
import {BootableDuck} from '@sha/fsa/src/createBootableDuck'
import {BRANDS, BrandVO} from './bootstrap/repos/brands'
import {LEGALS, LegalVO} from './bootstrap/repos/legals'
import {EMPLOYEES, EmployeesV0} from './bootstrap/repos/employees'
import SUBS, {SubVO} from './bootstrap/repos/subs'
import {RESOURCES_MAP} from "./bootstrap/resourcesList"
import {ExtractResource, getResLedger, LinkedProps} from "./bootstrap/core/createResource"

const factory = fsa.actionCreatorFactory('bootstrap')

const actions = {
    fetchBootstrap: factory.async<Bootstrap>('fetchBootstrap'),
    serverStateBootstraped: factory<Bootstrap>(
        'serverStateBootstraped'
    )
}

export const bootstrapCrudsMap = {
    users: USERS,
    sites: SITES,
    contracts: CONTRACTS,
    issues: ISSUES,
    brands: BRANDS,
    legals: LEGALS,
    subs: SUBS,
    employees: EMPLOYEES,
    expenses: EXPENSES,
    tasks: TASKS,
    notifications: NOTIFICATIONS,
    workTypes: LIST_WORK_TYPES,
}

export const bootstrapDucksMap = {
    ...bootstrapCrudsMap,
    config: configDuck,

    settings: settingsDuck,
}

export const bootstrapDucks = Object.values(bootstrapDucksMap)
export const bootstrapCruds = bootstrapDucks.filter(isCRUD)


type ReducersMapByDuck<Type extends {[key in string]: BootableDuck<any>}> = {
    [Property in keyof Type]: Type[Property]['reducer'];
};


const getReducersMapByDucks = <M extends {[key in string]: BootableDuck<any> }>(ducks: M): ReducersMapByDuck<M> => {
    const reducers = {}
    Object.keys(ducks).forEach(k => reducers[ducks[k].factoryPrefix] = ducks[k].reducer)
    return  reducers as any
}



const reducer =combineReducers(getReducersMapByDucks(bootstrapDucksMap))

export type Bootstrap = ReturnType<typeof reducer>




export const bootstrapDuck = {
    reducer,
    factory,
    actions,
    selectBootstrap: (state) =>
        state.app.bootstrap as Bootstrap,
}


export const selectLedger = (state: ISOState) => {

    const boot = state.app.bootstrap

    const users = getResLedger(USERS)(state)
    const sites = getResLedger(SITES)(state)
    const contracts = getResLedger(CONTRACTS)(state)
    const issues = getResLedger(ISSUES)(state)
    const brands = getResLedger(BRANDS)(state)
    const legals = getResLedger(LEGALS)(state)
    const subs = getResLedger(SUBS)(state)
    const employees = getResLedger(EMPLOYEES)(state)
    const expenses = getResLedger(EXPENSES)(state)
    const tasks = getResLedger(TASKS)(state)
    const notifications = getResLedger(NOTIFICATIONS)(state)
    const workTypes = getResLedger(LIST_WORK_TYPES)(state)

    const all: {[K in Lowercase<keyof typeof RESOURCES_MAP>] :{
        list: typeof RESOURCES_MAP[Uppercase<K>]['exampleItem'][],
        byId: Record<string, typeof RESOURCES_MAP[Uppercase<K>]['exampleItem']>,
        byName: Record<string, typeof RESOURCES_MAP[Uppercase<K>]['exampleItem']>,
        byRes: <M extends Extract<keyof typeof RESOURCES_MAP[Uppercase<K>]['exampleItem'], `${string}Id`>>(key:M)=>
            typeof RESOURCES_MAP[Uppercase<K>]['exampleItem'][]
    } } = {
        brands,
        legals,
        subs,
        employees,
        users,
        sites,
        contracts,
        issues,
        expenses,
        tasks,
        notifications,
        workTypes,
    }

    return {
        ...all,
        getLinkedResByName: (res: string, name: string) =>
            all[res.toLowerCase()].byName[name],
        getLinkedResById: (res: string, id: string) =>
            all[res.toLowerCase()].byId[id]
    }
}