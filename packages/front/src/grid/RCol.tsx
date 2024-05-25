import {ColDef} from 'ag-grid-community'
import {AnyFieldsMeta, ItemWithId, Resource} from 'iso/src/store/bootstrap/core/createResource'
import { CellRendererWithCopy } from '../components/elements/CellRendererWithCopy';
import {RCellRender} from './RCellRender'
import {isItemOfMeta} from 'iso/src/store/bootstrap/core/valueTypes'
import {getRes} from 'iso/src/store/bootstrap/resourcesList'
import useFrontSelector from '../hooks/common/useFrontSelector'
import {CellClassRules, ValueGetterFunc} from 'ag-grid-community/dist/lib/entities/colDef'

export const useAllColumns = <
    RID extends string,
    Fields extends AnyFieldsMeta,
>(res: Resource<RID, Fields>,rowSelection:'single' | 'multiple'|undefined  = undefined)=> {
    type Item = ItemWithId<RID, Fields>

    type CommonColsMap = { clickToEditCol: ColDef<Item, string,RID, Fields>, checkboxCol: ColDef, clientsNumberCol: ColDef }
    type ColsMap = CommonColsMap & {

        [K in keyof Fields]: ColDef<Item, Item[K], RID, Fields, K>
    }
    const state = useFrontSelector(state => state)

    const checkboxCol: ColDef= {
        checkboxSelection:true,
        headerCheckboxSelectionFilteredOnly:true,
        headerCheckboxSelection:  true,
        width:30,
        resizable: false,
    }

    const clickToEditCol: ColDef<Item, string,RID, Fields> = {
        headerName:'',
        field: res.idProp,
        sourceResourceName: res.resourceName,
        cellRenderer: rowSelection ? undefined : RCellRender.ClickToEdit,
        width:30,
        fieldName: res.idProp,
        resizable: false,
        resource: res,
    }

    const clientsNumberCol: ColDef<Item, string,RID, Fields> = {
        headerName:'Номер',
        field: res.clientsNumberProp,
        sourceResourceName: res.clientsNumberProp,
        width:100,
        fieldName: res.clientsNumberProp,
        resizable: false,
        resource: res,
        valueGetter: (params => {
            const value = params.data[res.clientsNumberProp];
            return isNaN(+value) ? value : +value;
        }) as ValueGetterFunc<any, string>,
        cellRenderer: CellRendererWithCopy,
    }

    const map: ColsMap = {clickToEditCol,checkboxCol,clientsNumberCol} as any
    const storedColumn = <K extends keyof Item> (
        property: K
    ): ColDef<Item,Item[K]> => {
        const fieldMeta = res.properties[property]
        const colInit :ColDef<Item, Item[K],RID,Fields ,K>= {
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

               if (value) {
                   const year = date.getFullYear()
                   const month = (date.getMonth()+1).toString().padStart(2,'0');
                   const day = date.getDate().toString().padStart(2,'0');
                    return `${day}-${month}-${year}`;
               }
               return undefined
           }
           colInit.valueFormatter = dateFormatter
           colInit.width = 100
           // colInit. = 'dateString'
        }
        if(isItemOfMeta(fieldMeta)){
            const RES = getRes(fieldMeta.linkedResourceName)

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
                        const it = RES.selectById(id)(state)
                        return RES.getItemName(it)
                    } catch (e){
                        console.error(e)
                        console.error(res.rid, params,params.colDef.field)
                        return id ? 'Удалён '+id : 'Не указан'
                    }

                }) as ValueGetterFunc<Item, Item[K]>
            } as ColDef
        }
        return colInit
    }


    const columnsList = res.fieldsList
        .filter((f,i)=> i!==0 && f.type!=='array' && f.colDef !== false)
        .map((f) => {
       const col = storedColumn(f.name)
        const colComposed = f.colDef? {...col, ...f.colDef} : col

        map[f.name] = colComposed


        return colComposed
    })
    return [[map.clickToEditCol, ...columnsList], map] as const
  //  return res.properties

}

export type StoredColumn<D,V, RID extends string, Fields extends AnyFieldsMeta> = {
    resource: Resource<RID, Fields>
} & ColDef<D, V>

export type ResCol = {}