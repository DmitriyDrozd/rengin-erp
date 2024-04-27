import { EXPENSES } from 'iso/src/store/bootstrap';
import {
    estimationStatusesList,
    estimationsStatusesColorsMap,
    ExpenseVO
} from 'iso/src/store/bootstrap/repos/expenses';
import { roleEnum } from 'iso/src/store/bootstrap/repos/users';
import { useAllColumns } from '../../../grid/RCol';
import PanelRGrid from '../../../grid/PanelRGrid';
import {
    IssueVO,
} from 'iso/src/store/bootstrap/repos/issues';
import useLocalStorageState from '../../../hooks/useLocalStorageState';
import { generateNewListItemNumber } from '../../../utils/byQueryGetters';
import AppLayout from '../../app/AppLayout';
import React from 'react';
import { ColDef } from 'ag-grid-community';
import {
    Space,
    Tag
} from 'antd';
import { NewValueParams } from 'ag-grid-community/dist/lib/entities/colDef';
import {
    useDispatch,
    useSelector
} from 'react-redux';
import useCurrentUser from '../../../hooks/useCurrentUser';
import { ExpenseModal } from './ExpenseModal';
import StatusFilterSelector from '../issues/StatusFilterSelector';
import { ExpenseEstimationsStatusCellEditor } from './ExpenseEstimationsStatusCellEditor';

const getEstimationStatusTag = (data: IssueVO) => {
    const { estimationsStatus } = data;
    return <Tag color={estimationsStatusesColorsMap[estimationsStatus]}>{estimationsStatus}</Tag>;
}

export const ExpensesListPage = () => {
    const currentItemId = window.location.hash === '' ? undefined : window.location.hash.slice(1);

    const {currentUser} = useCurrentUser();

    const allExpenses: ExpenseVO[] = useSelector(EXPENSES.selectAll);
    const statusPropToFilter = 'estimationsStatus';
    const newClientsNumber = generateNewListItemNumber(allExpenses, EXPENSES.clientsNumberProp);

    const dispatch = useDispatch();
    const [cols, colMap] = useAllColumns(EXPENSES);

    const columns = [
        {...colMap.clickToEditCol, headerName: 'id'},
        {...colMap.clientsNumberCol},
        {...colMap.legalId, width: 150},
        {...colMap.brandId, width: 150},

        {...colMap.managerUserId, width: 130},
        {...colMap.estimatorUserId, width: 130},

        {
            field: 'estimationsStatus',
            filter: 'agSetColumnFilter',
            filterParams: {
                applyMiniFilterWhileTyping: true,
            },
            headerName: 'Статус сметы',
            width: 150,
            editable: true,
            onCellValueChanged: (event: NewValueParams<IssueVO, IssueVO['estimationsStatus']>) => {
                const issue: Partial<IssueVO> = {issueId: event.data.issueId, estimationsStatus: event.newValue};
                dispatch(EXPENSES.actions.patched(issue));
            },
            cellEditor: ExpenseEstimationsStatusCellEditor,
            cellEditorParams: {
                values: (params) => [params.data.estimationsStatus, 'sd'],
                valueListGap: 0,
            },
            cellRenderer: (props) =>
                getEstimationStatusTag(props.data)
        },
        {...colMap.expensePrice, width: 130},
    ] as ColDef<ExpenseVO>[];

    const [statuses, setStatuses] = useLocalStorageState('statusFilter', estimationStatusesList);

    let dataForUser;

    switch (currentUser.role) {
        case roleEnum['менеджер']: {
            dataForUser = allExpenses.filter(i => i.managerUserId === currentUser.userId);
            break;
        }
        case roleEnum['сметчик']: {
            dataForUser = allExpenses.filter(i => i.estimatorUserId === currentUser.userId);
            break;
        }
        default: {
            dataForUser = allExpenses;
            break;
        }
    }

    const rowData = dataForUser.filter(s => !s[statusPropToFilter] || statuses.includes(s[statusPropToFilter]));

    const renderToolbar = (
        <Space>
            <StatusFilterSelector
                list={estimationStatusesList}
                colorMap={estimationsStatusesColorsMap}
                statuses={statuses}
                setStatuses={setStatuses}/>
        </Space>
    )

    return (
        <AppLayout
            hidePageContainer={true}
            proLayout={{
                contentStyle: {
                    padding: '0px'
                }
            }}
        >
            <div>
                {
                    currentItemId ? (
                        <ExpenseModal
                            id={currentItemId}
                            newClientsNumber={newClientsNumber}
                        />
                    ) : null
                }
                <PanelRGrid
                    isNotRoleSensitive
                    fullHeight
                    toolbar={renderToolbar}
                    rowData={rowData}
                    resource={EXPENSES}
                    columnDefs={columns}
                    title={'Итоговые сметы'}
                    name={'ExpensesList'}
                />
            </div>
        </AppLayout>
    );
}