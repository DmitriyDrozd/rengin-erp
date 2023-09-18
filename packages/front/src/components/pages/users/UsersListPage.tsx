import React from 'react'
import {ColumnsType} from 'antd/es/table'
import {getAbbrName, UserVO, default as USERS} from 'iso/src/store/bootstrap/repos/users'
import {useSelector} from 'react-redux'
import {useHistory, useParams} from 'react-router'
import {makeColumns} from '../../../grid/createColumns'
import {RCRUDTable} from '../../../grid/RCRUDTable'
import AppLayout from '../../app/AppLayout'
import AddItemButton from '../../elements/CreateButton'

export default () => {

    const params = useParams()
    console.log()

    const columns: ColumnsType<UserVO> = makeColumns<UserVO>()

        .addCol('email')
        .addCol('fullName', 'ФИО',
            (fullName, record) => <span>{getAbbrName(record)}</span>
        )
        .addCol('title','Должность')
        .addCol('role','Роль')
        .addEditCol('userId','/app/in/users')


    const history = useHistory()
    const list = useSelector(USERS.selectList)


    return (
        <AppLayout
            header={{

               /** breadcrumb: {

                    items: [{
                        path: '/app/in/users',
                        title: 'Пользователи',
                    },
                    ]
                }*/
            }}
        >

                <RCRUDTable itemNavBase={'/app/in/users'} dataSource={list} columns={columns} />

        </AppLayout>
    )
}