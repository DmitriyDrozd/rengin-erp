import {Breadcrumb, Button, Card, Col, Modal, Row, Space, Table, theme} from 'antd'
import React, {useState} from 'react'
import TicketsTable from '../TicketsTable'
import TicketForm from '../TicketForm'
import InnerPageBase from '../../app/InnerPageBase'
import {ColumnsType} from 'antd/es/table'
import {UserVO} from 'iso/src/store/bootstrap/repos/user-schema'
import {take} from 'ramda'
import {useSelector} from 'react-redux'
import {contractsCrud, usersCrud} from 'iso/src/store/bootstrap'
import {Link} from 'react-router-dom'
import {nav} from '../../nav'
import {getAbbrName} from 'iso/src/store/bootstrap/repos/users-crud'
import {useHistory} from 'react-router'
import AddItemFloatButton from '../../elements/AddItemFloatButton'
import {makeColumns} from '../../grid/createColumns'
import Search from 'antd/es/input/Search'
import AddItemButton from '../../elements/AddItemButton'
import {RCRUDTable} from '../../grid/RCRUDTable'
import {AddressVO} from 'iso/src/store/bootstrap/repos/addresses-schema'
import addressesCrud from 'iso/src/store/bootstrap/repos/addresses-crud'
import {AntdIcons} from '../../elements/AntdIcons'
import {editPageColumn} from '../../grid/commont-columns'
import {ContractVO} from 'iso/src/store/bootstrap/repos/contracts-schema'
import {createEditorPage} from '../createEditorPage'
import ContractEditor from '../../elements/ContractEditor'
export default () => {
    const crud = contractsCrud
    const columns: ColumnsType<ContractVO> = makeColumns<ContractVO>()
        .addCol('legalNumber', 'Номер')

        .addCol('addressIds','Объекты',{render: (list) => list?list.length: '0'})
        .addCol('managerId','Менеджер')
        .addEditCol('contractId','/app/in/contracts')


    const history = useHistory()
    const list = useSelector(crud.selectList)


    return (
        <InnerPageBase>
            <Breadcrumb style={{ margin: '16px 0' }}>
                <Breadcrumb.Item>Заказчики</Breadcrumb.Item>
            </Breadcrumb>
            <RCRUDTable itemNavBase={'/app/in/contracts'} dataSource={list} columns={columns} />
        </InnerPageBase>
    )
}

export const ContractItemPage = createEditorPage({crud: contractsCrud,Editor: ContractEditor,icon: <AntdIcons.PrinterFilled/>})