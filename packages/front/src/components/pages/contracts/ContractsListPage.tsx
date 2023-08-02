import {Breadcrumb} from 'antd'
import React from 'react'
import InnerPageBase from '../../app/InnerPageBase'
import {ColumnsType} from 'antd/es/table'
import {useSelector} from 'react-redux'
import {contractsCrud} from 'iso/src/store/bootstrap'
import {useHistory} from 'react-router'
import {makeColumns} from '../../../grid/createColumns'
import {RCRUDTable} from '../../../grid/RCRUDTable'
import {AntdIcons} from '../../elements/AntdIcons'
import {ContractVO} from 'iso/src/store/bootstrap/repos/contracts'
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
                <Breadcrumb.Item>Договора</Breadcrumb.Item>
            </Breadcrumb>
            <RCRUDTable itemNavBase={'/app/in/contracts'} dataSource={list} columns={columns}  name={'договора'}/>
        </InnerPageBase>
    )
}

export const ContractItemPage = createEditorPage({crud: contractsCrud,Editor: ContractEditor,icon: <AntdIcons.PrinterFilled/>})