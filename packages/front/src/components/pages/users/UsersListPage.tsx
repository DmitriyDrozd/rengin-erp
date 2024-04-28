import { ColDef } from 'ag-grid-community';
import { SiteVO } from 'iso/src/store/bootstrap/repos/sites';
import { useAllColumns } from '../../../grid/RCol';
import useLedger from '../../../hooks/useLedger';
import PanelRGrid from '../../../grid/PanelRGrid';
import { USERS } from 'iso/src/store/bootstrap';
import React from 'react';
import AppLayout from '../../app/AppLayout';
import EditUserModal from './UserModal';

export default () => {
    const ledger = useLedger();
    const list = ledger.users.list;
    const currentItemId = window.location.hash === '' ? undefined : window.location.hash.slice(1);

    const [cols, colMap] = useAllColumns(USERS);
    const columns: ColDef<SiteVO>[] = [
        {...colMap.clickToEditCol},
        {...colMap.clientsNumberCol},
        {...colMap.role, width: 200},
        {...colMap.brandId, width: 150},
        {...colMap.department, width: 150},
        {...colMap.lastname, width: 150},
        {...colMap.name, width: 150},
        {...colMap.title, width: 200},
        {...colMap.email, width: 180},
        {...colMap.phone, width: 150},
    ] as ColDef<SiteVO>[];

    return <AppLayout
        hidePageContainer={true}
        proLayout={{
            contentStyle: {
                padding: '0px'
            }
        }}
    >
        <div>
            {currentItemId && <EditUserModal id={currentItemId}/>}
            <PanelRGrid
                fullHeight
                columnDefs={columns}
                title={'Пользователи'}
                resource={USERS}
                rowData={list}
            />
        </div>
    </AppLayout>;
}