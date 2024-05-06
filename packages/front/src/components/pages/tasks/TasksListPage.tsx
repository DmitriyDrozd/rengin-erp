import {
    paymentStatusesColorsMap,
    paymentStatusesList,
    TASKS,
    taskStatusesColorsMap,
    taskStatusesList,
    TaskVO
} from 'iso/src/store/bootstrap/repos/tasks';
import { useAllColumns } from '../../../grid/RCol';
import PanelRGrid from '../../../grid/PanelRGrid';
import useLocalStorageState from '../../../hooks/useLocalStorageState';
import { generateNewListItemNumber } from '../../../utils/byQueryGetters';
import AppLayout from '../../app/AppLayout';
import React from 'react';
import { ColDef } from 'ag-grid-community';
import {
    Space,
    Tag
} from 'antd';
import {
    useSelector
} from 'react-redux';
import StatusFilterSelector from '../issues/StatusFilterSelector';
import { TasksModal } from './TasksModal';

const getTaskStatusTag = (data: TaskVO) => {
    const {taskStatus} = data;
    return <Tag color={taskStatusesColorsMap[taskStatus]}>{taskStatus}</Tag>;
};

const getPaymentStatusTag = (data: TaskVO) => {
    const {paymentStatus} = data;
    return <Tag color={paymentStatusesColorsMap[paymentStatus]}>{paymentStatus}</Tag>;
};

export const TasksListPage = () => {
    const currentItemId = window.location.hash === '' ? undefined : window.location.hash.slice(1);

    const allTasks: TaskVO[] = useSelector(TASKS.selectAll);
    const statusPropToFilter = 'taskStatus';
    const newClientsNumber = generateNewListItemNumber(allTasks, TASKS.clientsNumberProp);

    const [cols, colMap] = useAllColumns(TASKS);

    const columns = [
        {...colMap.clickToEditCol, headerName: 'id'},
        {...colMap.clientsNumberCol},
        {...colMap.description, width: 400},
        {...colMap.estimatedTime, width: 200},
        {...colMap.spentTime, width: 200},
        {
            ...colMap.taskStatus,
            width: 150,
            cellRenderer: (props) =>
                getTaskStatusTag(props.data)
        },
        {
            ...colMap.paymentStatus,
            width: 150,
            cellRenderer: (props) =>
                getPaymentStatusTag(props.data)
        },
    ] as ColDef<TaskVO>[];

    const [statuses, setStatuses] = useLocalStorageState('tasksStatusFilter', taskStatusesList);
    const [paymentStatuses, setPaymentStatuses] = useLocalStorageState('tasksPaymentFilter', taskStatusesList);

    const paymentFilteredTasks = allTasks.filter(s => !s.paymentStatus || paymentStatuses.includes(s.paymentStatus));
    const rowData = paymentFilteredTasks.filter(s => !s.taskStatus || statuses.includes(s.taskStatus));

    const renderToolbar = (
        <>
            <Space>
                Статус задачи:
                <StatusFilterSelector
                    list={taskStatusesList}
                    colorMap={taskStatusesColorsMap}
                    statuses={statuses}
                    setStatuses={setStatuses}/>
            </Space>
            <Space>
                Статус оплаты:
                <StatusFilterSelector
                    list={paymentStatusesList}
                    colorMap={paymentStatusesColorsMap}
                    statuses={paymentStatuses}
                    setStatuses={setPaymentStatuses}/>
            </Space>
        </>
    );

    return (
        <AppLayout
            hidePageContainer
            proLayout={{
                contentStyle: {
                    padding: '0px'
                }
            }}
        >
            <div>
                {
                    currentItemId ? (
                        <TasksModal
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
                    resource={TASKS}
                    columnDefs={columns}
                    title={'Задачи'}
                    name={'TasksList'}
                />
            </div>
        </AppLayout>
    );
};