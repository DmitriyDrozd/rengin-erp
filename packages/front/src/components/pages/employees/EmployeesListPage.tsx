import { ColDef } from 'ag-grid-community';
import {
    Button,
    Space
} from 'antd';
import { Link } from 'react-router-dom';
import { useAllColumns } from '../../../grid/RCol';
import useLedger from '../../../hooks/useLedger';
import PanelRGrid from '../../../grid/PanelRGrid';
import { EMPLOYEES } from 'iso/src/store/bootstrap';
import {
    EmployeeVO,
    employeeRoleEnum,
} from 'iso/src/store/bootstrap/repos/employees';
import React from 'react';
import useLocalStorageState from '../../../hooks/useLocalStorageState';
import AppLayout from '../../app/AppLayout';
import { AntdIcons } from '../../elements/AntdIcons';
import { getNav } from '../../getNav';
import StatusFilterSelector from '../issues/StatusFilterSelector';
import EditEmployeeModal from './EmployeeModal';

const employeesRoles = [employeeRoleEnum.техник, employeeRoleEnum['ответственный инженер']];
const roleFilterColorMap = {
    [employeeRoleEnum.техник]: 'green',
    [employeeRoleEnum['ответственный инженер']]: 'blue',
}

const BottomBar = () => {
    return (
        <Space>
            <Link to={getNav().importEmployees}>
                <Button icon={<AntdIcons.UploadOutlined/>}>
                    Импортировать сотрудников
                </Button>
            </Link>
        </Space>
    );
};

export default () => {
    const ledger = useLedger();
    const list = ledger.employees.list;
    const [filter, setFilter] = useLocalStorageState('employeeRoleFilter', employeesRoles);
    const rowData = list.filter(item => filter.includes(item.role));

    const currentItemId = window.location.hash === '' ? undefined : window.location.hash.slice(1);
    const [cols, colMap] = useAllColumns(EMPLOYEES);

    const columns: ColDef<EmployeeVO>[] = [
        {...colMap.clickToEditCol},
        {...colMap.clientsNumberCol},
        {...colMap.role, width: 200},
        {...colMap.brandId, width: 150},
        {...colMap.lastname, width: 150},
        {...colMap.name, width: 150},
        {...colMap.title, width: 200},
        {...colMap.email, width: 180},
        {...colMap.phone, width: 150},
    ] as ColDef<EmployeeVO>[];

    return (
        <AppLayout
            hidePageContainer
            proLayout={{
                contentStyle: {
                    padding: '0px',
                }
            }}
        >
            <div>
                {currentItemId && <EditEmployeeModal roles={employeesRoles} id={currentItemId}/>}
                <PanelRGrid
                    fullHeight
                    toolbar={(
                        <Space>
                            <StatusFilterSelector
                                list={employeesRoles}
                                colorMap={roleFilterColorMap}
                                statuses={filter}
                                setStatuses={setFilter}/>
                        </Space>
                    )}
                    columnDefs={columns}
                    title={'Сотрудники'}
                    resource={EMPLOYEES}
                    rowData={rowData}
                    BottomBar={BottomBar}
                />
            </div>
        </AppLayout>
    );
}