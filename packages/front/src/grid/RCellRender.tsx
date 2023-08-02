import React from 'react'
import {ColDef} from 'ag-grid-community'
import {Button} from 'antd'
import {useHistory} from 'react-router'
import usePathnameResource from '../hooks/usePathnameResource'
import getCrudPathname from '../hooks/getCrudPathname'
import {EditOutlined} from '@ant-design/icons'
import {Link} from 'react-router-dom'


type RCellRenderProps<D = any,V = any> = {
    data: D
    value: V
    colDef: ColDef<D, V>
}
export const RCellRender = {
    ClickToEdit: <D,V>(props:RCellRenderProps<D,V>) => {
        const history = useHistory()
        const pathRes = usePathnameResource()
        const url = getCrudPathname(pathRes.resource).edit(props.value)


            return (
                <Link to={url}>
                    <EditOutlined  />
                </Link>

            )

    }
}