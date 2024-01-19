import {GoogleSpreadsheet} from "google-spreadsheet";
import {ISSUES, SITES, USERS} from "iso/src/store/bootstrap/index.js";
import {AnyFieldsMeta, Resource} from "iso/src/store/bootstrap/core/createResource";
import {ServiceStore} from "service/src/store/configureServiceStore";
import {IssueVO} from "iso/src/store/bootstrap/repos/issues";
import {getResourcesByNames, RESOURCES_MAP} from "iso/src/store/bootstrap/resourcesList";
import {selectLedger} from "iso/src/store/bootstrapDuck";
type ImportStatus ='Да'| 'Ошибка' | 'Обновлено' | undefined
export default async (doc: GoogleSpreadsheet, store: ServiceStore) => {
    const state = store.getState()
    const ledger =selectLedger(state)
    const addTable = async  <RID extends string, Fields extends AnyFieldsMeta>(res: Resource<RID,Fields>)  => {
        const title = res.langRU.plural
        let sheet = doc.sheetsByTitle[title]
        const headerProps = getResourceHeaderProps(res)
        const headerValues = ['Ипорт',...headerProps.map( p => p.headerName)]
        if(sheet)
            await sheet.delete()
        sheet = await doc.addSheet({
            headerValues,
            title,

            gridProperties:{rowCount:1, columnCount:headerValues.length}}
        )
        const items = res.selectList(store.getState())
            const rows = items.map( i => {
                const row: any = {}
                headerProps.forEach( p => {
                    if(i[p.name]!==undefined)
                    row[p.name] = i[p.name]

                })
                return row
            })
       await sheet.addRows(rows,{})
    }
    await addTable(SITES)
    await addTable(USERS)

    const sheet =doc.sheetsByIndex[0]

    const headProps = getResourceHeaderProps(ISSUES)

    const headerValues = ['Импорт',...headProps.map(p => p.name)]

    const getColumnsIndexByHeader = (header: string) =>
        headerValues.indexOf(header)

    const getValueByHeader = (rowIndex: number, header: string) => {
        const columnIndex = getColumnsIndexByHeader(header)
        if(columnIndex < 0)
            return undefined
        return sheet.getCell(rowIndex, columnIndex).value
    }
    await sheet.setHeaderRow(headerValues)

    console.log(sheet.rowCount); // 2

    await sheet.loadCells('Заявки')
        type MappedItem =  {
            item: Partial<IssueVO>,
            errors: {
                [K in keyof IssueVO]?: string
            }
            rowIndex: number,
            importedStatus: ImportStatus
        }
    const mappedItems: MappedItem[] = []
    for(let rowIndex = 1; rowIndex < sheet.rowCount; rowIndex++) {

        const obj: MappedItem = {
            rowIndex,
            importedStatus: sheet.getCell(rowIndex,0).value as any as ImportStatus,
            item: {},
            errors:{}
        }
        ISSUES.fieldsList.forEach( p => {
            const rawValue = getValueByHeader(rowIndex, p.headerName)
            if(p.linkedResourceName) {
                const linkedRes: Resource<any, any> = RESOURCES_MAP[p.linkedResourceName]
                let linkedItem = ledger.getLinkedResByName(p.linkedResourceName, rawValue)

                if(rawValue && !linkedItem) {
                    obj.errors[p.name] = [`${linkedRes.langRU.singular} с определением ${rawValue} не существует`]
                }else {
                    obj.item[p.name] = linkedItem[linkedRes.idProp]
                }

            } else {
                obj.item[p.name] = rawValue
                if (p.required && !rawValue) {
                    obj.errors[p.name] = [`Требуется указать ${p.headerName}`]
                }
            }

        })
        for(var c = 1; c < sheet.columnCount;c++) {
            const row = sheet.g
        }
    }

}



const getResourceHeaderProps =
    <RID extends string, Fields extends AnyFieldsMeta>(res: Resource<RID,Fields>) =>
        res.fieldsList
            .filter( p => p.type !== 'array' && p.isIDProp===false && p.internal!==true)