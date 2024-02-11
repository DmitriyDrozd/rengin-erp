import type {GoogleSpreadsheet} from "iso/src/utils/importGoogleSpreadsheet";
import {AnyAttributes,EntitySlice} from "@shammasov/mydux";
import {ENTITIES_MAP, selectDigest, SITES, TICKETS, TicketVO, USERS} from "iso";

import {FrontStore} from "../../../../hooks/common/useFrontStore";

type ImportStatus ='Да'| 'Ошибка' | 'Обновлено' | undefined
export default async (doc: GoogleSpreadsheet, store: FrontStore) => {
    const state = store.getState()
    const digest =selectDigest(state)
    const addTable = async  <EID extends string, Attrs extends AnyAttributes>(res: EntitySlice<Attrs,EID>)  => {
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
        const items = res.selectors.selectAll(store.getState())
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

    const headProps = getResourceHeaderProps(TICKETS)

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
            item: Partial<TicketVO>,
            errors: {
                [K in keyof TicketVO]?: string
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
        TICKETS.attributesList.forEach(p => {
            const rawValue = getValueByHeader(rowIndex, p.headerName)
            if(p.linkedEID) {
                const linkedRes: EntitySlice<any, any> = ENTITIES_MAP[p.linkedEID]
                let linkedItem = digest.getLinkedResByName(p.linkedEID, rawValue)

                if(rawValue && !linkedItem) {
                    obj.errors[p.name] = [`${linkedRes.langRU.singular} с определением ${rawValue} не существует`]
                }else {
                    obj.item[p.name] = linkedItem.id
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
    <EID extends string, Attrs extends AnyAttributes>(res: EntitySlice<Attrs,EID>) =>
        res.attributesList
            .filter( p => p.type !== 'array' && p.name==='id' && p.internal!==true)