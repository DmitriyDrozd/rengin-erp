import {ColDef, Column} from 'ag-grid-community'
import {AnyFields, FieldsWithID, ItemWithId, Resource} from 'iso/src/store/bootstrap/core/createResource'
import {RCellRender} from './RCellRender'
import {valueTypes} from 'iso/src/store/bootstrap/core/valueTypes'
import useLedger from '../hooks/useLedger'
import {getRes} from 'iso/src/store/bootstrap/resourcesList'
import useFrontSelector from '../hooks/common/useFrontSelector'

export const useAllColumns = <
    RID extends string,
    Fields extends AnyFields,
    D extends  Resource<RID, Fields>['exampleItem']
>(res: Resource<RID, Fields>)=> {


    const ledger = useLedger()
    const state = useFrontSelector(state => state)
    //const clickToEditColumn = () =>
    const clickToEditCol = {
        headerName:'',
        field:res.idProp,
        cellRenderer: RCellRender.ClickToEdit,
        width:30,
        resizable: false
    }

    const storedColumn = <K extends keyof D> (
        property: K
    ): ColDef<D,K> => {
        if(property === res.idProp)
            return  clickToEditCol as any
        const field = res.properties[property]
        const colInit :ColDef<D,D[K]>= {
            headerName: field.headerName,
            resizable: true,
            sortable: true,
            field: field.name,
            editable: true,

        }
        if(field.type === 'itemOf'){
            return {
                ...colInit,
                valueGetter: params => {
                    const RES = getRes(field.res)

                    try {
                        const id = params.data[params.colDef.field]
                        const it = RES.selectById(id)(state)
                        return RES.getItemName(it)
                    } catch (e){
                        debugger
                        return 'Error'
                    }

                } }as ColDef<D>
        }
        return colInit
    }


    const cols = res.fieldsList.map(f => storedColumn(f.name))
    return cols
  //  return res.properties

}

export type StoredColumn<D,V, RID extends string, Fields extends AnyFields> = {
    resource: Resource<RID, Fields>
} & ColDef<D, V>

export type ResCol = {}