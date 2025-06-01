import 'ag-grid-enterprise';
// import 'ag-grid-community/styles/ag-grid.css';
// import 'ag-grid-community/styles/ag-theme-alpine.css';
//import './rengin-theme.css'
import {
    AgGridReact,
    AgGridReactProps
} from 'ag-grid-react';
import React, { useMemo } from 'react';
import AG_GRID_LOCALE_RU from './locale.ru';

import {
    AnyFieldsMeta,
    ItemWithId,
    Resource
} from 'iso/src/store/bootstrap/core/createResource';
import './styles.css';
//import {ResVal} from "iso/src/store/bootstrap/repos/res";
import {
    ISSUES,
    USERS
} from 'iso/src/store/bootstrap';
import { Meta } from 'iso/src/store/bootstrap/core/valueTypes';
import { ExcelExportParams, ProcessCellForExportParams } from 'ag-grid-enterprise';
import { checkIfCommentsCell, getCommentsExcelCell } from '../components/elements/CommentsLine';
import { useTheme } from '../hooks/useTheme';

export type ResVal = typeof USERS | typeof ISSUES

export type ValueTypeBeResAndProp<Res extends ResVal, Prop extends string | number | symbol> =
    Res extends { properties: { [key in Prop]: Meta<infer Type, infer TSType> } }
        ? Res['properties'][Prop]['tsType']
        : never
export type ItemTypeByRes<Res extends ResVal> =
    Res extends { exampleItem: infer T }
        ? Res['exampleItem']
        : never

export type CellEditorProps<Res extends ResVal, VType = any> = {
    data: ItemTypeByRes<Res>
    value: VType
}


export type RGridProps<RID extends string, Fields extends AnyFieldsMeta> = AgGridReactProps<ItemWithId<RID, Fields>> & {
    resource: Resource<RID, Fields>
    createItemProps?: Partial<ItemWithId<RID, Fields>>
    search?: string
    fullHeight?: boolean
    headerHeight?: number
}

const checkBoxColProps = {
    headerCheckboxSelection: true,
    checkboxSelection: true,
};

export const excelExportParams: ExcelExportParams = {
    processCellCallback(params: ProcessCellForExportParams<any, any>) {
        if (checkIfCommentsCell(params)) {
            return getCommentsExcelCell(params.value);
        }

        return params.formatValue(params.value);
    }
}

export default React.forwardRef(<RID extends string, Fields extends AnyFieldsMeta>({columnDefs, fullHeight, headerHeight = 0, ...props}: RGridProps<RID, Fields>, ref: React.ForwardedRef<any>) => {
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

    const decreaseHeight = (fullHeight ? 144 : 244) + headerHeight;
    const height = fullHeight ? `calc(100vh - ${decreaseHeight}px)` : `calc(100vh - ${decreaseHeight}px)`;

    const { theme } = useTheme();

    return (
        <div
            className="ag-theme-alpine"
            style={{height, width: '100%'}}
        >
            <AgGridReact<ItemWithId<RID, Fields>>
                theme={theme}
                ref={ref}
                localeText={localeText}
                columnDefs={columnDefs}
                defaultColDef={{resizable: true, sortable: true}}
                cellSelection={true}
                allowContextMenuWithControlKey={true}
                {...props}
            />
        </div>
    );
});