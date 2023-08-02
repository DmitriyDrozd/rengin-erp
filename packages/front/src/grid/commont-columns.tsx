import {BuildNav} from '../components/nav'
import {ColumnType} from 'antd/es/table'
import {Link} from 'react-router-dom'
import {AntdIcons} from '../components/elements/AntdIcons'
import {Button} from 'antd'
import React from 'react'

export const editPageColumn = (idProp: string, nav:BuildNav): ColumnType<any> => ({
    key:idProp+'_edit',
    title: ' ',
    dataIndex: idProp,
    render: id => <Link to={nav({[idProp]:id})}><Button icon={<AntdIcons.EditFilled/>}/></Link>
})