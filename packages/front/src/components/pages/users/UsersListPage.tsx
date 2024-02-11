import {useAllColumns} from '../../../grid/RCol'
import useDigest from '../../../hooks/useDigest'
import PanelRGrid from '../../../grid/PanelRGrid'
import {USERS} from "iso";
import {useHistory, useRouteMatch} from "react-router";
import React from "react";
import AppLayout from "../../app/AppLayout";
import EditUserModal from "./UserModal";

export default () => {
    const digest = useDigest()
    const list = digest.users.list
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