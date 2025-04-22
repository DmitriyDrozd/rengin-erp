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
    employeeRoleTypes,
} from 'iso/src/store/bootstrap/repos/employees';
import React, { FC, useMemo, useState } from 'react';
import useLocalStorageState from '../../../hooks/useLocalStorageState';
import AppLayout from '../../app/AppLayout';
import { AntdIcons } from '../../elements/AntdIcons';
import { getNav } from '../../getNav';
import StatusFilterSelector from '../issues/StatusFilterSelector';
import EditEmployeeModal from './EmployeeModal';
import Switch from 'antd/es/switch';
import { getCommentsCell } from '../../elements/CommentsLine';
import { Days } from 'iso';

const roleFilterColorMap = {
    [employeeRoleEnum.техник]: 'green',
    [employeeRoleEnum['ответственный инженер']]: 'blue',
    [employeeRoleEnum['техник ИТ']]: 'darkgreen',
    [employeeRoleEnum['техник Сервис']]: 'orange',
    [employeeRoleEnum['бригадир СМР']]: 'grey',
}

const BottomBar = (isImportDisabled?: boolean) => {
    if (isImportDisabled) {
        return null;
    }
    
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

interface EmployeesListPageProps {
    title?: string,
    href?: string,
    panelProps?: unknown,
    isImportDisabled?: boolean,
    categoryFilter?: (employee: EmployeeVO) => boolean,
};

const EmployeesListPage: FC<EmployeesListPageProps> = ({ 
    title = 'Сотрудники',
    href,
    panelProps = {},
    isImportDisabled = false,
    categoryFilter = (employee) => true,
}) => {
    const ledger = useLedger();
    const list = ledger.employees.list;
    const [filter, setFilter] = useLocalStorageState('employeeRoleFilter', employeeRoleTypes);
    const [isInternalEmployees, setIsInternalEmployees] = useState(true);
    const isProvidedPage = href === 'provided';
    const rowData = list
        .filter(categoryFilter)
        .filter(item => filter.includes(item.role))
        .filter(item => isInternalEmployees ? !item.brandId : true);

    const currentItemId = window.location.hash === '' ? undefined : window.location.hash.slice(1);
    const [cols, colMap] = useAllColumns(EMPLOYEES);

    const currentNovosibTime = Days.getNovosibTime();

    const columns: ColDef<EmployeeVO>[] = [
        {...colMap.clickToEditCol},
        {...colMap.clientsNumberCol},
        {...colMap.role, width: 200},
        {...colMap.brandId, width: 150},
        {
            width: 150, 
            cellRenderer: getCommentsCell('managerComment'), 
            field: "managerComment",
            fieldName:"managerComment",
            headerName: 'Комментарий от менеджера'
        },
        {
            width: 150, 
            cellRenderer: getCommentsCell('employeeComment'), 
            field: "employeeComment",
            fieldName:"employeeComment",
            headerName: 'Комментарий от сотрудника'
        },
        {...colMap.name, width: 150},
        {...colMap.title, width: 200},
        {...colMap.phone, width: 150},
        {...colMap.city, width: 150},
        {...colMap.region, width: 150},
        {...colMap.department, width: 150},
        {...colMap.searchType, width: 150},
        {...colMap.sourceLink, width: 150},
        {
            ...colMap.timezone, 
            width: 150,
            cellRenderer: (props) => {
                if (!props.data.timezone) {
                    return '';
                }

                const value = Number(props.data.timezone);
                const method = value > 0 ? 'add' : 'subtract';
                const shiftedTime = currentNovosibTime[method](Math.abs(value), 'h');

                return <span>{props.data.timezone}: <b>{shiftedTime.format('HH:mm')}</b></span>
            }
        },
    ] as ColDef<EmployeeVO>[];

    const toolbar = (
        <Space>
            <Switch 
                title='отображаемые сотрудники'
                value={isInternalEmployees}
                checkedChildren="внутренние" 
                unCheckedChildren="все"
                onChange={setIsInternalEmployees}
            />
            <StatusFilterSelector
                list={employeeRoleTypes}
                colorMap={roleFilterColorMap}
                statuses={filter}
                setStatuses={setFilter}/>
        </Space>
    );

    const bottomBar = useMemo(() => () => BottomBar(isImportDisabled), [isImportDisabled]);

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
                {currentItemId && <EditEmployeeModal roles={employeeRoleTypes} id={currentItemId} isProvidedPage={isProvidedPage}/>}
                <PanelRGrid
                    fullHeight
                    toolbar={toolbar}
                    columnDefs={columns}
                    title={title}
                    resource={EMPLOYEES}
                    rowData={rowData}
                    BottomBar={bottomBar}
                    href={href}
                    {...panelProps}
                />
            </div>
        </AppLayout>
    );
}

export default EmployeesListPage;
