/*
 * useAgGrid.tsx - Provide AGGridProperties
 *
 * Created by Dr. Maximillian Dornseif 2021-09
 * Copyright (c) 2021 Dr. Maximillian Dornseif
 */

import {ClientSideRowModelModule} from '@ag-grid-community/client-side-row-model'
import {ColumnApi, GridApi, GridOptions, GridReadyEvent, ModuleRegistry} from '@ag-grid-community/core' // @ag-grid-community/core will always be implicitly available
import {CsvExportModule} from '@ag-grid-community/csv-export'
import {GridChartsModule} from '@ag-grid-enterprise/charts'
import {ClipboardModule} from '@ag-grid-enterprise/clipboard'
import {ColumnsToolPanelModule} from '@ag-grid-enterprise/column-tool-panel'
import {LicenseManager} from '@ag-grid-enterprise/core'
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
import {useCallback, useState} from 'react'
import mem from 'mem'
import '@ag-grid-community/core/dist/styles/ag-grid.css';

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

export const agGridDefaultOptions: GridOptions = {
    // skipHeaderOnAutoSize: true,
    defaultColDef: {
        sortable: true,
        filter: true,
        resizable: true,
        enablePivot: true,
        enableRowGroup: true,
        enableValue: true,
        filterParams: { newRowsAction: 'keep' },
    },
    enableRangeSelection: true,
    enableCharts: true, // https://www.ag-grid.com/javascript-grid-charts-integrated-overview/
    groupIncludeFooter: true, // https://www.ag-grid.com/javascript-grid-grouping/
    pivotRowTotals: 'after', // https://www.ag-grid.com/javascript-grid-pivoting/#pivotRowTotals
    suppressPreventDefaultOnMouseWheel: true,
    suppressScrollOnNewData: true,
    sideBar: {
        toolPanels: [
            {
                id: 'columns',
                labelDefault: 'Spalten',
                labelKey: 'columns',
                iconKey: 'columns',
                toolPanel: 'agColumnsToolPanel',
            },
            {
                id: 'filters',
                labelDefault: 'Filter',
                labelKey: 'filters',
                iconKey: 'filter',
                toolPanel: 'agFiltersToolPanel',
            },
        ],
    },
    statusBar: {
        statusPanels: [
            { statusPanel: 'agTotalAndFilteredRowCountComponent', align: 'left' },
            { statusPanel: 'agSelectedRowCountComponent', align: 'center' },
            { statusPanel: 'agAggregationComponent', align: 'right' },
        ],
    },
}

function _installLicense(license?: string): void {
    if(license && license.length > 0) {
        LicenseManager.setLicenseKey(license)
    }
}
export const installLicense = mem(_installLicense, );

export interface IGridApi {
    api?: GridApi
    columnApi?: ColumnApi
}

export function useAgGrid<TData = any>(license?: string): IGridApi & { onGridReady: (event: GridReadyEvent) => void } {
    const [gridApi, setGridApi] = useState<IGridApi>({
        api: undefined,
        columnApi: undefined,
    })
    const onGridReady = useCallback((params) => {
        const { api, columnApi } = params
        setGridApi({ api, columnApi })
        setTimeout(() => api.sizeColumnsToFit(), 25)
    }, [setGridApi])
    installLicense(license)


    return {
        onGridReady,
        ...(gridApi && gridApi),
    }
}