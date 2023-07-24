import {Breadcrumb, Button, Card, Col, Modal, Row, Space, Table, theme} from 'antd'
import React, {useState} from 'react'
import TicketsTable from '../TicketsTable'
import TicketForm from '../TicketForm'
import InnerPageBase from '../../app/InnerPageBase'
import {ColumnsType} from 'antd/es/table'
import {UserVO} from 'iso/src/store/bootstrap/repos/user-schema'
import {take} from 'ramda'
import {useSelector} from 'react-redux'
import {usersCrud} from 'iso/src/store/bootstrap'
import {Link} from 'react-router-dom'
import {nav} from '../../nav'
import {getAbbrName} from 'iso/src/store/bootstrap/repos/users-crud'
import {useHistory} from 'react-router'
import AddItemFloatButton from '../../elements/AddItemFloatButton'
import {makeColumns} from '../../grid/createColumns'
import Search from 'antd/es/input/Search'
import AddItemButton from '../../elements/AddItemButton'
import {RCRUDTable} from '../../grid/RCRUDTable'
import {AntdIcons} from '../../elements/AntdIcons'
import {UserOutlined} from '@ant-design/icons'
export default () => {
    const columns: ColumnsType<UserVO> = makeColumns<UserVO>()

        .addCol('email')
        .addCol('fullName', 'ФИО',
            (fullName, record) => <span>{getAbbrName(record)}</span>
        )
        .addCol('title','Должность')
        .addCol('role','Роль')
        .addEditCol('userId','/app/in/users')


    const history = useHistory()
    const list = useSelector(usersCrud.selectList)


    return (
        <InnerPageBase>
            <Breadcrumb style={{ margin: '16px 0' }}
                        items={[
                                {

                                    title:  <Link to={'/app/in/start'}><AntdIcons.HomeOutlined /></Link>,
                                },
                                {

                                    title: (
                                        <Link >
                                            <UserOutlined />
                                            <span>Пользователи</span>
                                        </Link>
                                    ),
                                }]
            }
            >

            </Breadcrumb>
            <RCRUDTable itemNavBase={'/app/in/users'} dataSource={list} columns={columns} />
        </InnerPageBase>
    )
}