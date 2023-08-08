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
>(res: Resource<RID, Fields>, )=> {
    type Item = ItemWithId<RID, Fields>

    type CommonColsMap = { clickToEditCol: ColDef<Item, string,RID, Fields>}
    type ColsMap = CommonColsMap & {

        [K in keyof Fields]: ColDef<Item, Item[K], RID, Fields, K>
    }
const sourceResourceName = res.resourceName
    const ledger = useLedger()
    const state = useFrontSelector(state => state)
    //const clickToEditColumn = () =>
    const clickToEditCol: ColDef<Item, string,RID, Fields> = {
        headerName:'',
        field:res.idProp,
        sourceResourceName: res.resourceName,
        cellRenderer: RCellRender.ClickToEdit,
        width:30,
        fieldName: res.idProp,
        resizable: false,
        resource: res,
    }

    const map: ColsMap = {clickToEditCol} as any
    const storedColumn = <K extends keyof Item> (
        property: K
    ): ColDef<Item,Item[K]> => {
        if(property === res.idProp)
            return  clickToEditCol as any
        const fieldMeta = res.properties[property]
        const colInit :ColDef<Item, Item[K],RID,Fields ,K>= {
            headerName: fieldMeta.headerName,
            resizable: true,
            sortable: true,
            field:property,
            fieldName:property,
            editable: true,
            resource: res,


        }
        if(isItemOfMeta(fieldMeta)){
            const RES = getRes(fieldMeta.linkedResourceName)
            return {
                ...colInit,
                valueGetter: (params => {


                    try {
                        const id = params.data[params.colDef.field]
                        const it = RES.selectById(id)(state)
                        return RES.getItemName(it)
                    } catch (e){
                        console.error(e)
                        return 'Непривязан'
                    }

                }) as ValueGetterFunc<Item, Item[K]>
            }
        }
        return colInit
    }


    const columnsList = res.fieldsList.map(f => {
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