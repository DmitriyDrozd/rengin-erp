import React from 'react'
import {ColDef} from 'ag-grid-community'
import {Button} from 'antd'
import {useHistory} from 'react-router'
import usePathnameResource from '../hooks/usePathnameResource'
import getCrudPathname from '../hooks/getCrudPathname'
import {EditOutlined} from '@ant-design/icons'
import {Link} from 'react-router-dom'
import {getRes, ResourceName} from 'iso/src/store/bootstrap/resourcesList'
import {AnyFieldsMeta, ItemWithId} from 'iso/src/store/bootstrap/core/createResource'


type RCellRenderProps<D = any,V = any> = {
    data: D
    value: V
    colDef: ColDef<D, V>
}


export type RCol<RID extends string, Fields extends AnyFieldsMeta, Prop extends keyof ItemWithId<RID, Fields>> =
    ColDef<ItemWithId<RID, Fields>,ItemWithId<RID, Fields>[Prop],RID, Fields,Prop>

export const RCellRender = {
    ClickToEdit: <D,V>(props:RCellRenderProps<D,V>) => {
        const resource = props.colDef.resource
        const url = getCrudPathname(resource).edit(props.value)
            return (
                <Link to={url}>
                    <EditOutlined  />
                </Link>

            )
    }
}