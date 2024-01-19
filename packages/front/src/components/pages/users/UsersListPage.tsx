import {useAllColumns} from '../../../grid/RCol'
import useLedger from '../../../hooks/useLedger'
import PanelRGrid from '../../../grid/PanelRGrid'
import {USERS} from "iso/src/store/bootstrap";
import {useHistory, useRouteMatch} from "react-router";
import React from "react";
import AppLayout from "../../app/AppLayout";
import EditUserModal from "./UserModal";
import {getNav} from "../../getNav";

export default () => {
    const ledger = useLedger()
    const list = ledger.users
    const [cols] = useAllColumns(USERS)
    const routeMatch = useRouteMatch<{userId:string}>()

    const currentItemId = window.location.hash === '' ? undefined : window.location.hash.slice(1)
    const history = useHistory()



    return  <AppLayout
        hidePageContainer={true}
        proLayout={{contentStyle:{
                padding: '0px'
            }
        }}
    >
        <div>
            {
                currentItemId ? <EditUserModal id={currentItemId} /> : null
            }

             <PanelRGrid
                fullHeight={true}
                title={'Пользователи'}
                resource={USERS}
                rowData={list}

            />
        </div>
    </AppLayout>
}