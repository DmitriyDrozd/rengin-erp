import { ISSUES } from 'iso/src/store/bootstrap';
import { Days } from 'iso/src/utils';
import React from 'react';
import PanelRGrid from '../../../../grid/PanelRGrid';
import { useAllColumns } from '../../../../grid/RCol';

export const DashboardIssuesList = ({ rowData }) => {
    const [cols, colMap] = useAllColumns(ISSUES);

    const defaultColumns = [
        {...colMap.clickToEditCol, headerName: 'id'},
        {...colMap.clientsNumberCol},
        {...colMap.registerDate, width: 150, cellRenderer: (props) => Days.toDayString(props.data?.registerDate)},
        {...colMap.status},
        {...colMap.brandId, width: 150},
        {...colMap.siteId, width: 250},
        {...colMap.description, width: 250},
        {...colMap.contactInfo, width: 100},
        {...colMap.plannedDate, cellRenderer: (props) => Days.toDayString(props.data?.plannedDate)},
        {...colMap.completedDate, cellRenderer: (props) => Days.toDayString(props.data?.completedDate), width: 115},
        {...colMap.managerUserId, width: 130},
        {...colMap.techUserId, width: 130},
        {...colMap.clientsEngineerUserId, width: 130},
        {...colMap.estimatorUserId, width: 130},
        {...colMap.estimationsStatus},
        {...colMap.estimationPrice, editable: false, width: 130},
        {...colMap.expensePrice, editable: false, width: 100},
        {...colMap.dateFR, width: 150, cellRenderer: ({data}) => Days.asMonthYear(data.dateFR)},
    ];

    return (
        <PanelRGrid
            isCreateButtonDisabled
            fullHeight
            rowData={rowData}
            resource={ISSUES}
            columnDefs={defaultColumns}
            title={'Заявки дашборда'}
            name={'DashboardIssuesList'}
        />
    );
}