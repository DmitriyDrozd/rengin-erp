import {ColDef, Column} from 'ag-grid-community'
import {AnyFieldsMeta, FieldsWithIDMeta, ItemWithId, Resource} from 'iso/src/store/bootstrap/core/createResource'
import {RCellRender} from './RCellRender'
import {isItemOfMeta, valueTypes} from 'iso/src/store/bootstrap/core/valueTypes'
import useLedger from '../hooks/useLedger'
import {getRes} from 'iso/src/store/bootstrap/resourcesList'
import useFrontSelector from '../hooks/common/useFrontSelector'
import {ValueGetterFunc} from 'ag-grid-community/dist/lib/entities/colDef'

export const useAllColumns = <
    RID extends string,
    Fields extends AnyFieldsMeta,
>(res: Resource<RID, Fields>,rowSelection:'single' | 'multiple'|undefined  = undefined)=> {
    type Item = ItemWithId<RID, Fields>

    type CommonColsMap = { clickToEditCol: ColDef<Item, string,RID, Fields>, checkboxCol: ColDef }
    type ColsMap = CommonColsMap & {

        [K in keyof Fields]: ColDef<Item, Item[K], RID, Fields, K>
    }
const sourceResourceName = res.resourceName
    const ledger = useLedger()
    const state = useFrontSelector(state => state)
    //const clickToEditColumn = () =>

    const checkboxCol: ColDef= {
        checkboxSelection:true,
        headerCheckboxSelectionFilteredOnly:true,
        headerCheckboxSelection:  true,

        width:30,

        resizable: false,

    }
    const clickToEditCol: ColDef<Item, string,RID, Fields> = {
        headerName:'',
        field:res.idProp,
        sourceResourceName: res.resourceName,
        cellRenderer: rowSelection ? undefined : RCellRender.ClickToEdit,
        width:30,
        fieldName: res.idProp,
        resizable: false,
        resource: res,

    }

    const map: ColsMap = {clickToEditCol,checkboxCol} as any
    const storedColumn = <K extends keyof Item> (
        property: K
    ): ColDef<Item,Item[K]> => {
        const fieldMeta = res.properties[property]
        const colInit :ColDef<Item, Item[K],RID,Fields ,K>= {
            headerName: fieldMeta.headerName,
            resizable: true,
            sortable: true,
            field:property,
            fieldName:property,
            editable: true,
            resource: res,
            filter:true,



        }
        if(isItemOfMeta(fieldMeta)){
            const RES = getRes(fieldMeta.linkedResourceName)
            return {
                ...colInit,
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
            }
        }
        return colInit
    }


    const columnsList = res.fieldsList.filter((f,i)=> i!==0).map((f) => {
       const col = storedColumn(f.name)
        map[f.name] = col

        return col
    })
    return [columnsList, map] as const
  //  return res.properties

}

export type StoredColumn<D,V, RID extends string, Fields extends AnyFieldsMeta> = {
    resource: Resource<RID, Fields>
} & ColDef<D, V>

export type ResCol = {}