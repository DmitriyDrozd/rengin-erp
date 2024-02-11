import React from 'react'
import {ColDef} from 'ag-grid-community'
import getCrudPathname from '../hooks/getCrudPathname'
import {EditOutlined} from '@ant-design/icons'
import {Link} from 'react-router-dom'
import {AnyAttributes,ItemByAttrs} from '@shammasov/mydux'


type RCellRenderProps<D = any,V = any> = {
    data: D
    value: V
    colDef: ColDef<D, V>
}


export type RCol<EID extends string, Attrs extends AnyAttributes, Prop extends keyof ItemByAttrs<Attrs>> =
    ColDef<ItemByAttrs<Attrs>,ItemByAttrs<Attrs>[Prop],EID, Attrs,Prop>

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