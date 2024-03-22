import { EditOutlined } from '@ant-design/icons';
import { ColDef } from 'ag-grid-community';
import { SiteVO } from 'iso/src/store/bootstrap/repos/sites';
import {
    roleEnum,
    UserVO
} from 'iso/src/store/bootstrap/repos/users';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import { useAllColumns } from '../../../grid/RCol';
import getCrudPathname from '../../../hooks/getCrudPathname';
import useLedger from '../../../hooks/useLedger';
import PanelRGrid from '../../../grid/PanelRGrid';
import { USERS } from 'iso/src/store/bootstrap';
import React from 'react';
import AppLayout from '../../app/AppLayout';
import { getNav } from '../../getNav';
import EditEmployeeModal from './EmployeeModal';

const employeesRoles = [roleEnum.техник, roleEnum.сметчик, roleEnum['ответственный инженер']];
const employeesFilter = ({role}: UserVO) => employeesRoles.includes(role);

const crud = getCrudPathname(USERS);
const getCrudUrl = (url: string) => url.replace('users', 'users-employees');

// todo: показывать только для менеджеров, контакты тоже? или ограничить возможность редактирования
export default () => {
    const ledger = useLedger();
    const list = ledger.users.list.filter(employeesFilter);

    const currentItemId = window.location.hash === '' ? undefined : window.location.hash.slice(1);
    const [cols, colMap] = useAllColumns(USERS);
    const history = useHistory()

    const onCreateClick = () => {
        const url = getCrudUrl(crud.create());
        history.push(url);
    }

    const columns: ColDef<SiteVO>[] = [
        {
            ...colMap.clickToEditCol,
            cellRenderer: colMap.clickToEditCol ? (props: { value: string }) => {
                const url = getCrudUrl(crud.edit(props.value));

                return (
                    <Link to={url}>
                        <EditOutlined/>
                    </Link>
                );
            } : undefined,},
        {...colMap.clientsNumberCol},
        {...colMap.role, width: 200},
        {...colMap.brandId, width: 150},
        {...colMap.lastname, width: 150},
        {...colMap.name, width: 150},
        {...colMap.title, width: 200},
        {...colMap.email, width: 180},
        {...colMap.phone, width: 150},
    ] as ColDef<SiteVO>[];

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
                    resource={USERS}
                    rowData={list}
                    createHandler={onCreateClick}
                />
            </div>
        </AppLayout>
    );
}