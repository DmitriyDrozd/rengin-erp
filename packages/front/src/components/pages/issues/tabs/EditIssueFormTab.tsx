import {DatePicker, Descriptions, DescriptionsProps, Form, Typography} from 'antd'
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
import {IssueVO, Status, statusesRulesForManager} from 'iso/src/store/bootstrap/repos/issues'
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
import useRole from "../../../../hooks/useRole";
import {useUnmount} from "react-use";
import DescriptionsItem from "antd/es/descriptions/Item";
import {today} from "ionicons/icons";
const { Text } = Typography;
export default () => {
    const role = useRole()
    const {issue,setIssue,setIssueProperty} = useIssue()
    const layoutProps = {
        labelCol: { span: 6 },
        wrapperCol: { span:18 },
    }

    const formRef = useRef<ProFormInstance<IssueVO>>();
    type Item = IssueVO
    const brands: BrandVO[] = useSelector(BRANDS.selectList) as any
    const brandsOptions = BRANDS.asValueEnum(brands)
    const brandId = issue.brandId
    const legalId = issue.legalId
    const siteId = issue.siteId
    const legals = useSelector(LEGALS.selectList)
    const sites = useSelector(SITES.selectList)
    const legalsOptions=LEGALS.asValueEnum(legals.filter(l => l.brandId === brandId))
    const sitesOptions = SITES.asOptions(sites.filter(l => l.legalId === legalId))
    const contracts: ContractVO[] = useSelector(CONTRACTS.selectList)
    const subs: SubVO[] = useSelector(SUBS.selectList)
    const sub = subs.find(s => s.siteId === issue.siteId) || {contractId: undefined}
    const contract = contracts.find(c => c.contractId === issue.contractId )

    const buildDate = (name: keyof IssueVO) => {
        return   <RenFormDate
                       {...fieldMetaToProProps(ISSUES, name, issue)}
                       value={issue[name]}
                       onValueChange={
                           setIssueProperty(name)
                       }
                       disabled={role==='сметчик' || role === 'менеджер'}
                       label={ISSUES.properties[name].headerName}  width={'sm'}
                />
    }

    const buildText = (name: keyof IssueVO,multiline: boolean = true) => {
        return <RenFormText {...fieldMetaToProProps(ISSUES, name, issue)}
                     value={issue[name]}

                            multiline={multiline}
                            disabled={role==='сметчик'}
                     onValueChange={
                         setIssueProperty(name)
                     }
                     label={ISSUES.properties[name].headerName}  width={'sm'}
        />
    }

    const buildCheckbox = (name: keyof IssueVO) => {
        return  <RenFormCheckbox {...fieldMetaToProProps(ISSUES, name, issue)}
                                    value={issue[name]}
                                    onValueChange={
                                        setIssueProperty(name)
                                    }
                                    label={ISSUES.properties[name].headerName}  width={'sm'}
                />
    }

    const buildSelect = (name: keyof IssueVO) => {
        return <RenFormSelect
            {...fieldMetaToProProps(ISSUES, name, issue)}
            value={issue[name]}
            onValueChange={
                setIssueProperty(name)
            }
            disabled={role==='сметчик'}
            label={ISSUES.properties[name].headerName}
            width={'sm'}
        />

    }


    const items=[{
            label:ISSUES.properties.estimationPrice.headerName,
            children: issue.estimationPrice
        },{
            label:'Прибыль',
            children: issue.estimationPrice - issue.expensePrice

    }, {
        label:ISSUES.properties.expensePrice.headerName,
        children: issue.expensePrice
    }, {
            label:'Маржинальность',
            children: ( issue.estimationPrice && issue.expensePrice)
                ? (((issue.estimationPrice - issue.expensePrice) / issue.estimationPrice * 100).toFixed(2) + '%')
                : "-"
        }]
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
        */}
        <ProFormSelect readonly={true} disabled={issue.brandId === undefined} label={'Организация'} placeholder={'Выберите организацию'}   required={true} valueEnum={legalsOptions} name={'legalId'}  rules={[{required: true}]}/>
        <RenFormSelect
            style={{minWidth:'350px',maxWidth: '350px'}}
            label={'Адрес'}
            options={sitesOptions}
            disabled={role!=='руководитель'}
            placeholder={'Адрес не указан'}
            value={issue.siteId}
            showSearch={true}
            onValueChange={
                setIssueProperty('siteId')
            }
        />
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
                buildText('responsibleEngineer', false)
            }
            {
                buildText('contactInfo')
            }
            <RenFormSelect
                label={'Статус'}
                disabled={role==='сметчик'}
                options={optionsFromValuesList(ISSUES.properties.status.enum).map( o => {
                    if(role === 'менеджер') {
                        const availableStatuses  = statusesRulesForManager[issue.status]
                        o.disabled = !availableStatuses.includes(o.value)
                    }
                    return o
                })}
                placeholder={'Статус не указан'}
                value={issue.status}
                onValueChange={ (value: Status) => {
                    if(value === 'В работе') {
                        setIssueProperty('workStartedDate')(today)
                    }
                    if(value === 'Выполнена') {
                        setIssueProperty('completedDate')(today)
                    }
                     setIssueProperty('status')(value)
            }}/>
        {
            buildCheckbox('estimationsApproved')
        }
        <Descriptions
            column={2}
            title="Показатели"
            size={'small'}
bordered={true}

        >{items.map( ({label, children}, index) => <DescriptionsItem label={label} key={index}>{children}</DescriptionsItem>)}</Descriptions>

    </RForm>

}