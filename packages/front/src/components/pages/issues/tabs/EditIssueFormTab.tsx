import {DatePicker, Form, Typography} from 'antd'
import {ISSUES, SITES} from 'iso/src/store/bootstrap'
import React, {useRef, useState} from 'react'
import {
    ProFormCheckbox,
    ProFormDatePicker,
    ProFormInstance, ProFormItem,
    ProFormSelect,
    ProFormText,
    ProFormTextArea
} from '@ant-design/pro-components'
import {IssueVO} from 'iso/src/store/bootstrap/repos/issues'
import {useQueryObject} from '../../../../hooks/useQueryObject'
import {useDispatch, useSelector} from 'react-redux'
import {useHistory} from 'react-router'
import BRANDS, {BrandVO} from 'iso/src/store/bootstrap/repos/brands'
import CONTRACTS, {ContractVO} from 'iso/src/store/bootstrap/repos/contracts'
import SUBS, {SubVO} from 'iso/src/store/bootstrap/repos/subs'
import {RForm} from '../../../elements/RForm'
import {fieldMetaToProProps} from '../../chapter-routed/ItemChapter'
import LEGALS from 'iso/src/store/bootstrap/repos/legals'
import RenFormDate from "../../../form/RenFormDate";
import locale from 'antd/es/date-picker/locale/ru_RU';

import 'dayjs/locale/ru'
import dayjs from "dayjs";
import useIssue from "../../../../contexts/useIssue";
import RenFormSelect, {optionsFromValuesList} from "../../../form/RenFormSelect";
import RenFormText from "../../../form/RenFormText";
import RenFormCheckbox from "../../../form/RenFormCheckbox";
const { Text } = Typography;
export default () => {
    const {issue,setIssue,setIssueProperty} = useIssue()
    const layoutProps = {
        labelCol: { span: 6 },
        wrapperCol: { span:18 },
    }
    const resource = ISSUES
    const formRef = useRef<ProFormInstance<IssueVO>>();
    const idProp = ISSUES.idProp
    type Item = IssueVO
    const brands: BrandVO[] = useSelector(BRANDS.selectList) as any
    const brandsOptions = BRANDS.asValueEnum(brands)
    const brandId = issue.brandId
    const legalId = issue.legalId
    const siteId = issue.siteId
    const legals = useSelector(LEGALS.selectList)
    const sites = useSelector(SITES.selectList)
    const legalsOptions=LEGALS.asValueEnum(legals.filter(l => l.brandId === brandId))
    const sitesOptions = SITES.asValueEnum(sites.filter(l => l.legalId === legalId))
    const contracts: ContractVO[] = useSelector(CONTRACTS.selectList)
    const subs: SubVO[] = useSelector(SUBS.selectList)
    const sub = subs.find(s => s.siteId === issue.siteId) || {contractId: undefined}
    const contract = contracts.find(c => c.contractId === issue.contractId )

    const buildDate = (name: keyof IssueVO) => {
        return   <RenFormDate {...fieldMetaToProProps(ISSUES, name, issue)}
                                   value={issue[name]}
                                   onValueChange={
                                       setIssueProperty(name)
                                   }
                                   label={ISSUES.properties[name].headerName}  width={'sm'}
                    />
    }

    const buildText = (name: keyof IssueVO) => {
        return <RenFormText {...fieldMetaToProProps(ISSUES, name, issue)}
                     value={issue[name]}
                     onValueChange={
                         setIssueProperty(name)
                     }
                     label={ISSUES.properties[name].headerName}  width={'sm'}
        />
    }

    const buildCheckbox = (name: keyof IssueVO) => {
        return <RenFormCheckbox {...fieldMetaToProProps(ISSUES, name, issue)}
                            value={issue[name]}
                            onValueChange={
                                setIssueProperty(name)
                            }
                            label={ISSUES.properties[name].headerName}  width={'sm'}
        />
    }

    const buildSelect = (name: keyof IssueVO) => {
        return <RenFormSelect {...fieldMetaToProProps(ISSUES, name, issue)}
                              value={issue[name]}
                              onValueChange={
                                  setIssueProperty(name)
                              }
                              label={ISSUES.properties[name].headerName}  width={'sm'}
        />

    }
    return <RForm<Item>
            formRef={formRef}
            layout={'horizontal'}
            {
                ...layoutProps
            }
            readonly={false}
            initialValues={issue}
            submitter={{
                render: (props) => null
            }}
        >
            <ProFormSelect readonly={true} showSearch={true} label={'Заказчик'} placeholder={'Выберите заказчика'}  required={true} valueEnum={brandsOptions} name={'brandId'}  rules={[{required: true}]}/>
        {/*<ProForm.Item label={'Организация'}>
            <Text></Text>
        </ProForm.Item>
        */}<ProFormSelect readonly={true} disabled={issue.brandId === undefined} label={'Организация'} placeholder={'Выберите организацию'}   required={true} valueEnum={legalsOptions} name={'legalId'}  rules={[{required: true}]}/>

            <ProFormSelect readonly={true} showSearch={true} disabled={issue.legalId === undefined} label={'Адрес'} placeholder={'Выберите адрес'}   required={true} valueEnum={sitesOptions} name={'siteId'} rules={[{required: true}]}/>
            <ProFormItem name="contractId" label="Договор">
                {
                    contract
                        ? <Text type="success">{contract.contractNumber}</Text>
                        : <Text type="warning">Договор не найден</Text>
                }
            </ProFormItem>

            <ProFormDatePicker readonly={true} {...fieldMetaToProProps(ISSUES, 'registerDate', issue) } label={'Зарегистрирована'}  width={'sm'} />
            {
                buildDate('plannedDate')
            }
            {
                buildDate('workStartedDate')
            }
            {
                buildDate('completedDate')
            }
            {
                buildText('description')
            }
            {
                buildSelect('responsibleManagerId')
            }
            {
                buildText('responsibleEngineer')
            }
            {
                buildText('contactInfo')
            }
            <RenFormSelect label={'Статус'}  options={optionsFromValuesList(ISSUES.properties.status.enum)} placeholder={'Статус не указан'}  value={issue.status}
                           onValueChange={
                               setIssueProperty('status')
                           }/>
            {
                buildCheckbox('estimationsApproved')
            }
            <ProFormText {...fieldMetaToProProps(ISSUES,'estimationPrice')} readonly={true} />
            <ProFormText {...fieldMetaToProProps(ISSUES,'expensePrice')} readonly={true}  />

        <ProFormItem name="contractId" label="Прибыль">
            {
                issue.estimationPrice - issue.expensePrice
            }
        </ProFormItem>
        <ProFormItem name="contractId" label="Маржинальность">
            {
                ( issue.estimationPrice && issue.expensePrice)
                    ? (((issue.estimationPrice - issue.expensePrice) / issue.estimationPrice * 100).toFixed(2) + '%')
                    : "-"
            }
        </ProFormItem>
    </RForm>

}