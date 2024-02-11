import {ColDef} from 'ag-grid-community'
import {AnyAttributes, EntitySlice, isItemOfAttr, ItemByAttrs} from '@shammasov/mydux'
import {RCellRender} from './RCellRender'
import useDigest from '../hooks/useDigest'
import useFrontSelector from '../hooks/common/useFrontSelector'
import {CellClassRules, ValueGetterFunc} from 'ag-grid-community/dist/lib/entities/colDef'
import {getEntityByEID} from "iso";

export const useAllColumns = <
    EID extends string,
    Attrs extends AnyAttributes,
>(res: EntitySlice<Attrs, EID>,rowSelection:'single' | 'multiple'|undefined  = undefined)=> {
    type Item = ItemByAttrs<Attrs>

    type CommonColsMap = { clickToEditCol: ColDef<Item, string,EID, Attrs>, checkboxCol: ColDef }
    type ColsMap = CommonColsMap & {

        [K in keyof Attrs]: ColDef<Item, Item[K], EID, Attrs, K>
    }
const sourceResourceName = res.EID
    const digest = useDigest()
    const state = useFrontSelector(state => state)
    //const clickToEditColumn = () =>

    const checkboxCol: ColDef= {
        checkboxSelection:true,
        headerCheckboxSelectionFilteredOnly:true,
        headerCheckboxSelection:  true,

        width:30,

        resizable: false,

    }
    const clickToEditCol: ColDef<Item, string,EID, Attrs> = {
        headerName:'',
        field:'id',

        sourceResourceName: res.getItemName,
        cellRenderer: rowSelection ? undefined : RCellRender.ClickToEdit,
        width:120,
        fieldName: 'id',
        resizable: false,
        resource: res,

    }

    const map: ColsMap = {clickToEditCol,checkboxCol} as any
    const storedColumn = <K extends keyof Item> (
        property: K
    ): ColDef<Item,Item[K]> => {
        const fieldMeta = res.attributes[property]
        const colInit :ColDef<Item, Item[K],EID,Attrs ,K>= {
            editable: false,
            headerName: fieldMeta.headerName,
            resizable: true,
            sortable: true,
            field: property,
            fieldName:property,


            resource: res,
            filter:true,
            width: 120
        }
       if(fieldMeta.type === 'date') {
           function dateFormatter(params) {
               const value = params.data[property]
               var date = new Date(value);
               if(value)
                return `${date.getFullYear()}/${(date.getMonth()+1).toString().padStart(2,'0')}/${date.getDate().toString().padStart(2,'0')}`;
               return undefined
           }
           colInit.valueFormatter = dateFormatter
           colInit.width = 100
           // colInit. = 'dateString'
        }
        if(isItemOfAttr(fieldMeta)){
            const RES = getEntityByEID(fieldMeta.linkedEID)

            const cellClassRules:CellClassRules<Item> = {}
            if(fieldMeta.required) {
                cellClassRules['grid-cell-required'] = params => params.data[params.colDef.field]=== undefined
            }

            return {
                ...colInit,
                cellClassRules,
                valueGetter: (params => {


                    const id = params.data[params.colDef.field]
                    try {
                        const it = RES.selectors.selectById(id)(state)
                        return RES.getItemName(it)
                    } catch (e){
                        console.error(e)
                        console.error(res.EID, params,params.colDef.field)
                        return id ? 'Удалён '+id : 'Не указан'
                    }

                }) as ValueGetterFunc<Item, Item[K]>
            } as ColDef
        }
        return colInit
    }


    const columnsList = res.attributesList.filter((f,i)=> i!==0 && f.type!=='array' && f.colDef !== false).map((f) => {
       const col = storedColumn(f.name)
        const colComposed = f.colDef? {...col, ...f.colDef} : col

        map[f.name] = colComposed


        return colComposed
    })
    return [[map.clickToEditCol, ...columnsList], map] as const
  //  return res.attributes

}

export type StoredColumn<D,V, EID extends string, Attrs extends AnyAttributes> = {
    resource: EntitySlice<Attrs, EID>
} & ColDef<D, V>

export type ResCol = {}