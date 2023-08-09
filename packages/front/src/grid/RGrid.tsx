

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
//import './rengin-theme.css'
import {AgGridReact, AgGridReactProps} from 'ag-grid-react'
import React, {useMemo, useRef} from 'react'
import AG_GRID_LOCALE_RU from './locale.ru'
import {agGridDefaultOptions, useAgGrid} from '../hooks/useAgGrid'


import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model'
import { ColumnApi, GridApi, GridOptions, GridReadyEvent, ModuleRegistry } from '@ag-grid-community/core' // @ag-grid-community/core will always be implicitly available
import { CsvExportModule } from '@ag-grid-community/csv-export'
import { GridChartsModule } from '@ag-grid-enterprise/charts'
import { ClipboardModule } from '@ag-grid-enterprise/clipboard'
import { ColumnsToolPanelModule } from '@ag-grid-enterprise/column-tool-panel'
import { LicenseManager } from '@ag-grid-enterprise/core'
import { ExcelExportModule } from '@ag-grid-enterprise/excel-export'
import { FiltersToolPanelModule } from '@ag-grid-enterprise/filter-tool-panel'
import { MenuModule } from '@ag-grid-enterprise/menu'
import { MultiFilterModule } from '@ag-grid-enterprise/multi-filter'
import { RangeSelectionModule } from '@ag-grid-enterprise/range-selection'
import { RichSelectModule } from '@ag-grid-enterprise/rich-select'
import { RowGroupingModule } from '@ag-grid-enterprise/row-grouping'
import { SetFilterModule } from '@ag-grid-enterprise/set-filter'
import { SideBarModule } from '@ag-grid-enterprise/side-bar'
import { StatusBarModule } from '@ag-grid-enterprise/status-bar'
import { useCallback, useState } from 'react'
import mem from 'mem'
import '@ag-grid-community/core/dist/styles/ag-grid.css';
import {AnyFieldsMeta, ExtractResource, ItemWithId, Resource} from 'iso/src/store/bootstrap/core/createResource'
import {CheckboxSelectionCallbackParams, ColDef, HeaderCheckboxSelectionCallbackParams} from 'ag-grid-community'
import DeleteButton from '../components/elements/DeleteButton'
import CancelButton from '../components/elements/CancelButton'

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

        return  <div className="ag-theme-alpine" style={{height: fullHeight ?  'calc(100vh - 104px)':'calc(100vh - 244px)', width: '100%'}}>
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


}, )