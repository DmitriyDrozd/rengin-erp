import {Form, Typography} from 'antd'
import {CONTRACTS, ContractVO, TICKETS} from 'iso'
import React from 'react'
import {useSelector} from 'react-redux'
import 'dayjs/locale/ru'
import useRole from "../../../../hooks/useRole";
import FinanceFooter from "./FinanceFooter";
import RenField from "../../../form/RenField";
import {useContextEditor} from "../../chapter-modal/useEditor";
import {layoutPropsModalForm} from "../../../form/ModalForm";

const { Text } = Typography
export default () => {
    const role = useRole()
    const editor = useContextEditor()
    console.log('EDITOR',editor)
    const layoutProps = {
        labelCol: { span: 6 },
        wrapperCol: { span:18 },
    }

    const contracts: ContractVO[] = useSelector(CONTRACTS.selectors.selectAll)
    const contract = contracts.find(c => c.contractId === editor.item.contractId )



    return <Form
    style={{ maxWidth: 800 }}
    {
    ...layoutPropsModalForm
    }
    layout={'horizontal'}


        >
            <RenField meta={TICKETS.attributes.brandId}  />
            <RenField meta={TICKETS.attributes.legalId}  />
            <RenField
                    style={{minWidth:'350px',maxWidth: '350px'}}
                    disabled={role!=='руководитель'}
                    placeholder={'Адрес не указан'}
                    meta={TICKETS.attributes.siteId}
                />
             <Form.Item name="contractId" label="Договор">
                {
                    contract
                        ? <Text type="success">{contract.contractNumber}</Text>
                        : <Text type="warning">Договор не найден</Text>
                }
            </Form.Item>
            <RenField meta={TICKETS.fields.registerDate} disabled/>
        <RenField meta={TICKETS.attributes.plannedDate} disabled={role==='сметчик' || role === 'менеджер'}
                  width={'sm'}/>
        <RenField meta={TICKETS.attributes.workStartedDate} disabled={role==='сметчик' || role === 'менеджер'}
                  width={'sm'}/>
        <RenField meta={TICKETS.attributes.completedDate} disabled={role==='сметчик' || role === 'менеджер'}
                  width={'sm'}/>
        <RenField meta={TICKETS.attributes.description}
                  multiline={true}
                  disabled={role==='сметчик'}
                  width={'sm'}/>
        <RenField meta={TICKETS.attributes.managerUserId}

                  disabled={role==='сметчик'}
                  width={'sm'}/>
        <RenField meta={TICKETS.attributes.clientsEngineerUserId}

                  disabled={role==='сметчик'}
                  width={'sm'}/>
        <RenField meta={TICKETS.attributes.techUserId}

                  disabled={role==='сметчик'}
                  width={'sm'}/>

        <RenField meta={TICKETS.attributes.contactInfo}
                  multiline={true}

                  width={'sm'}/>
            <RenField meta={TICKETS.attributes.status}/>
        <RenField meta={TICKETS.attributes.estimationsApproved}

                  width={'sm'}/>
        <FinanceFooter issue={editor.item} />
    </Form>

}