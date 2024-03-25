import { ColDef } from 'ag-grid-community';
import { useAllColumns } from '../../../grid/RCol';
import useLedger from '../../../hooks/useLedger';
import PanelRGrid from '../../../grid/PanelRGrid';
import { EMPLOYEES } from 'iso/src/store/bootstrap';
import { EmployeeVO, employeeRoleEnum } from 'iso/src/store/bootstrap/repos/employees';
import React from 'react';
import AppLayout from '../../app/AppLayout';
import EditEmployeeModal from './EmployeeModal';

const employeesRoles = [employeeRoleEnum.техник, employeeRoleEnum['ответственный инженер']];

export default () => {
    const ledger = useLedger();
    const list = ledger.employees.list;

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
                    columnDefs={columns}
                    title={'Сотрудники'}
                    resource={EMPLOYEES}
                    rowData={list}
                />
            </div>
        </AppLayout>
    );
}