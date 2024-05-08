import {
    paymentStatusesColorsMap,
    paymentStatusesList,
    TASKS,
    taskStatusesColorsMap,
    taskStatusesList,
    TaskVO
} from 'iso/src/store/bootstrap/repos/tasks';
import { roleEnum } from 'iso/src/store/bootstrap/repos/users';
import { useAllColumns } from '../../../grid/RCol';
import PanelRGrid from '../../../grid/PanelRGrid';
import useLocalStorageState from '../../../hooks/useLocalStorageState';
import useRole from '../../../hooks/useRole';
import { generateNewListItemNumber } from '../../../utils/byQueryGetters';
import AppLayout from '../../app/AppLayout';
import React, { useState } from 'react';
import { ColDef } from 'ag-grid-community';
import {
    Modal,
    Space,
    Tag
} from 'antd';
import {
    useSelector
} from 'react-redux';
import { AntdIcons } from '../../elements/AntdIcons';
import StatusFilterSelector from '../issues/StatusFilterSelector';
import { TasksModal } from './TasksModal';
import Typography from 'antd/lib/typography';

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

    const role = useRole();
    const isAdminRole = role === roleEnum['руководитель'];
    const allTasks: TaskVO[] = useSelector(TASKS.selectAll);
    const statusPropToFilter = 'taskStatus';
    const newClientsNumber = generateNewListItemNumber(allTasks, TASKS.clientsNumberProp);

    const [cols, colMap] = useAllColumns(TASKS);

    const columns = [
        {...colMap.clickToEditCol, headerName: 'id'},
        {...colMap.clientsNumberCol},
        {...colMap.description, width: 400},
        {...colMap.estimatedTime, width: 200, cellRenderer: (props) => isNaN(+props.data.estimatedTime) ? 0 : +props.data.estimatedTime},
        {...colMap.spentTime, width: 200, cellRenderer: (props) => isNaN(+props.data.spentTime) ? 0 : +props.data.spentTime},
        {
            ...colMap.taskStatus,
            width: 150,
            cellRenderer: (props) =>
                getTaskStatusTag(props.data)
        },
        isAdminRole ?
        {
            ...colMap.paymentStatus,
            width: 150,
            cellRenderer: (props) =>
                getPaymentStatusTag(props.data)
        } : {},
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
            {
                isAdminRole && (
                    <Space>
                        Статус оплаты:
                        <StatusFilterSelector
                            list={paymentStatusesList}
                            colorMap={paymentStatusesColorsMap}
                            statuses={paymentStatuses}
                            setStatuses={setPaymentStatuses}/>
                    </Space>
                )
            }
        </>
    );

    const [selectedTasks, setSelectedTasks] = useState([]);
    const resetSelectedTasks = () => setSelectedTasks([]);

    const sumSpentTime = (selectedIds: string[]) => {
        const tasks = selectedIds.map(id => allTasks.find(at => at.taskId === id));
        setSelectedTasks(tasks);
    }

    const estimatedTime = Math.round(selectedTasks.reduce((acc, curr) => isNaN(+curr.estimatedTime) ? acc : acc + +curr.estimatedTime, 0) * 10) / 10;
    const spentTime = Math.round(selectedTasks.reduce((acc, curr) => isNaN(+curr.spentTime) ? acc : acc + +curr.spentTime, 0) * 10) / 10;

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
                <Modal title="Сумма времени" open={selectedTasks.length > 0} onOk={resetSelectedTasks} onCancel={resetSelectedTasks}>
                    <p>
                        <Typography.Text>Выбрано {selectedTasks.length} задач</Typography.Text>
                    </p>
                    <p>
                        <Typography.Text>Планируемая сумма времени: {estimatedTime} часов</Typography.Text>
                    </p>
                    <p>
                        <Typography.Text>Сумма затраченного времени: {spentTime} часов</Typography.Text>
                    </p>
                </Modal>
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
                    selectRowsProps={{
                        icon: <AntdIcons.CalculatorOutlined />,
                        onClick: sumSpentTime,
                        label: 'Посчитать сумму часов'
                    }}
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