import 'ag-grid-enterprise'
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
//import './rengin-theme.css'
import {AgGridReact, AgGridReactProps} from 'ag-grid-react'
import React, {useMemo} from 'react'
import AG_GRID_LOCALE_RU from './locale.ru'


import {AnyFieldsMeta, ItemWithId, Resource} from 'iso/src/store/bootstrap/core/createResource'
import './styles.css'
//import {ResVal} from "iso/src/store/bootstrap/repos/res";
import {ISSUES, USERS} from "iso/src/store/bootstrap";
import {Meta} from "iso/src/store/bootstrap/core/valueTypes";

export type ResVal = typeof USERS | typeof ISSUES

export type ValueTypeBeResAndProp <Res extends ResVal, Prop extends string | number | symbol> =
    Res extends {properties: {[key in Prop]: Meta<infer Type, infer TSType>} }
        ? Res['properties'][Prop]['tsType']
        : never
export type ItemTypeByRes  <Res extends ResVal> =
    Res extends {exampleItem: infer T}
    ? Res['exampleItem']
    : never

export type CellEditorProps<Res extends ResVal, VType = any> =  {
    data: ItemTypeByRes<Res>
    value: VType
}


export type RGridProps<RID extends string, Fields extends AnyFieldsMeta> = AgGridReactProps<ItemWithId<RID, Fields>> & {
    resource: Resource<RID, Fields>
    createItemProps?: Partial<ItemWithId<RID, Fields>>
    search?: string
    fullHeight?: boolean

}

const checkBoxColProps = {
    headerCheckboxSelection: true,
    checkboxSelection: true,
}
export default React.forwardRef( <RID extends string, Fields extends AnyFieldsMeta>({columnDefs , fullHeight,...props}: RGridProps<RID, Fields>, ref:React.ForwardedRef<any>) => {

   /* const onFilterTextBoxChanged = useCallback(() => {
        gridRef.current!.api.setQuickFilter(
            (document.getElementById('filter-text-box') as HTMLInputElement).value
        );
    }, []);*/
        const localeText = useMemo<{
                [key: string]: string;
            }>(() => {
                return AG_GRID_LOCALE_RU;
            }, []);

        return <> <div className="ag-theme-alpine" style={{height: fullHeight ?  'calc(100vh - 144px)':'calc(100vh - 244px)', width: '100%'}}>
                    <AgGridReact<ItemWithId<RID, Fields>>
                        ref={ref}
                        localeText={localeText}
columnDefs={columnDefs}
                        defaultColDef={{resizable: true,sortable:true}}
                        enableRangeSelection={true}
                        allowContextMenuWithControlKey={true}
                        {...props}
                    >

                    </AgGridReact>
                </div>

            </>


}, )