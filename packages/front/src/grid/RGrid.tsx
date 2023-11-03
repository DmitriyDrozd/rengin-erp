import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
//import './rengin-theme.css'
import {AgGridReact, AgGridReactProps} from 'ag-grid-react'
import React, {useMemo} from 'react'
import AG_GRID_LOCALE_RU from './locale.ru'


import {ClientSideRowModelModule} from '@ag-grid-community/client-side-row-model'
import 'ag-grid-enterprise'
import {ModuleRegistry} from '@ag-grid-community/core' // @ag-grid-community/core will always be implicitly available
import {CsvExportModule} from '@ag-grid-community/csv-export'
import {GridChartsModule} from '@ag-grid-enterprise/charts'
import {ClipboardModule} from '@ag-grid-enterprise/clipboard'
import {ColumnsToolPanelModule} from '@ag-grid-enterprise/column-tool-panel'
import {ExcelExportModule} from '@ag-grid-enterprise/excel-export'
import {FiltersToolPanelModule} from '@ag-grid-enterprise/filter-tool-panel'
import {MenuModule} from '@ag-grid-enterprise/menu'
import {MultiFilterModule} from '@ag-grid-enterprise/multi-filter'
import {RangeSelectionModule} from '@ag-grid-enterprise/range-selection'
import {RichSelectModule} from '@ag-grid-enterprise/rich-select'
import {RowGroupingModule} from '@ag-grid-enterprise/row-grouping'
import {SetFilterModule} from '@ag-grid-enterprise/set-filter'
import {SideBarModule} from '@ag-grid-enterprise/side-bar'
import {StatusBarModule} from '@ag-grid-enterprise/status-bar'
import '@ag-grid-community/core/dist/styles/ag-grid.css';
import {AnyFieldsMeta, FieldsWithIDMeta, ItemWithId, Resource} from 'iso/src/store/bootstrap/core/createResource'
import './styles.css'
import {ItemByRID, ResMap} from "iso";
//import {ResVal} from "iso/src/store/bootstrap/repos/res";
import {ISSUES, USERS} from "iso/src/store/bootstrap";
import {MetaType, Meta} from "iso/src/store/bootstrap/core/valueTypes";
import {Button, Space, Typography} from "antd";
import {ExpenseItem} from "iso/src/store/bootstrap/repos/issues";
import {DownloadOutlined} from "@ant-design/icons";

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

ModuleRegistry.registerModules([
    ClientSideRowModelModule,
    ClipboardModule,
    ColumnsToolPanelModule,
    CsvExportModule,
    ExcelExportModule,
    FiltersToolPanelModule,
    MenuModule,
    MultiFilterModule,
    RangeSelectionModule,
    RichSelectModule,
    RowGroupingModule,
    SetFilterModule,
    SideBarModule,
    StatusBarModule,
    GridChartsModule,
])

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

         console.log(columnDefs)

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