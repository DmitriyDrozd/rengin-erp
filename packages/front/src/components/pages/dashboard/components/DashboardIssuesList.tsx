import { GridApi } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { ISSUES } from 'iso/src/store/bootstrap';
import { Days } from 'iso/src/utils';
import React, { FC } from 'react';
import PanelRGrid from '../../../../grid/PanelRGrid';
import { useAllColumns } from '../../../../grid/RCol';
import { getCommentsCell } from '../../../elements/CommentsLine';

interface IDashboardIssuesList {
    gridRef: React.RefObject<AgGridReact>,
    rowData: any[],
    onFilterChanged({ api }: { api: GridApi }): void;
}

export const DashboardIssuesList: FC<IDashboardIssuesList> = ({ gridRef, rowData, onFilterChanged }) => {
    const [cols, colMap] = useAllColumns(ISSUES);

    const defaultColumns = [
        {...colMap.clickToEditCol, headerName: 'id'},
        {...colMap.clientsNumberCol},
        {...colMap.registerDate, width: 150, cellRenderer: (props) => Days.toDayString(props.data?.registerDate)},
        {...colMap.status},
        {...colMap.brandId, width: 150},
        {...colMap.siteId, width: 250},
        {...colMap.description, width: 250},
        {
            ...colMap.contactInfo,
            width: 150, 
            cellRenderer: getCommentsCell('contactInfo'),
            headerName: 'Комментарии', 
            field: "contactInfo", 
            fieldName:"contactInfo",
        },
        {...colMap.plannedDate, cellRenderer: (props) => Days.toDayString(props.data?.plannedDate)},
        {...colMap.completedDate, cellRenderer: (props) => Days.toDayString(props.data?.completedDate), width: 115},
        {...colMap.managerUserId, width: 130},
        {...colMap.techUserId, width: 130},
        {...colMap.clientsEngineerUserId, width: 130},
        {...colMap.estimatorUserId, width: 130},
        {...colMap.estimationsStatus},
        {...colMap.estimationPrice, editable: false, width: 130},
        {...colMap.expensePrice, editable: false, width: 100},
        {...colMap.dateFR, width: 150, cellRenderer: (props) => Days.asMonthYear(props.data?.dateFR)},
    ];

    return (
        <PanelRGrid
            isCreateButtonDisabled
            gridRef={gridRef}
            rowData={rowData}
            resource={ISSUES}
            columnDefs={defaultColumns}
            title={'Заявки дашборда'}
            name={'DashboardIssuesList'}
            onFilterChanged={onFilterChanged}
        />
    );
}