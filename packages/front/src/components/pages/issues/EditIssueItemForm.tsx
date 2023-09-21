import {Breadcrumb, Button, Form, Typography} from 'antd'
import {ISSUES, SITES} from 'iso/src/store/bootstrap'
import React, {useRef, useState} from 'react'
import {
    ProForm, ProFormCheckbox,
    ProFormDatePicker,
    ProFormField,
    ProFormInstance,
    ProFormSelect, ProFormText,
    ProFormTextArea
} from '@ant-design/pro-components'
import {IssueVO} from 'iso/src/store/bootstrap/repos/issues'
import {useQueryObject} from '../../../hooks/useQueryObject'
import {useDispatch, useSelector} from 'react-redux'
import {useHistory} from 'react-router'
import BRANDS, {BrandVO} from 'iso/src/store/bootstrap/repos/brands'
import CONTRACTS, {ContractVO} from 'iso/src/store/bootstrap/repos/contracts'
import SUBS, {SubVO} from 'iso/src/store/bootstrap/repos/subs'
import {RForm} from '../../elements/RForm'
import {fieldMetaToProProps} from '../chapter-routed/ItemChapter'
import LEGALS from 'iso/src/store/bootstrap/repos/legals'
import {useMount} from "react-use";

const { Text } = Typography;
export default ({issueId, onItemChange}: {issueId: string, onItemChange: Function}) => {

    const layoutProps = {
        labelCol: { span: 6 },
        wrapperCol: { span:18 },
    }
    const resource = ISSUES
    const formRef = useRef<
        ProFormInstance<IssueVO>
    >();
    const idProp = ISSUES.idProp
    type Item = IssueVO
    const id =issueId
    const predefinedValues = useQueryObject<IssueVO>()
    const initialValues:IssueVO =useSelector(ISSUES.selectById(issueId))
    const [state, setState] = useState(initialValues) as any as [Item, (otem: Item)=>any]
    const dispatch = useDispatch()

    const onSubmit = async (values: Item) => {
        const patch = {[idProp]:id, ...values}
        const action = ISSUES.actions.patched(patch)
        console.log('Submit', values, action)
        dispatch(action)

        //            dispatch(BRANDS.actions.added(values))
    }

    console.log('Initial alues', initialValues)
    const history = useHistory()


    const onSave = () => {
        formRef.current?.submit()
    }
    const onDelete = () => {
        onBack()
    }
    const onBack = () =>
        history.goBack()

    const title =
        <span>{"Новая заявка"}</span>


    const brands: BrandVO[] = useSelector(BRANDS.selectList) as any
    const brandsOptions = BRANDS.asValueEnum(brands)
    const brandId = state.brandId
    const legalId = state.legalId
    const siteId = state.siteId

    const legals = useSelector(LEGALS.selectList)

    const sites = useSelector(SITES.selectList)
    const legalsOptions=LEGALS.asValueEnum(legals.filter(l => l.brandId === brandId))


    const sitesOptions = SITES.asValueEnum(sites.filter(l => l.legalId === legalId))
    const contracts: ContractVO[] = useSelector(CONTRACTS.selectList)
    const subs: SubVO[] = useSelector(SUBS.selectList)
    const sub = subs.find(s => s.siteId === state.siteId) || {contractId: undefined}
    const contract = contracts.find(c => c.contractId === state.contractId )

    console.log('contractId', state.contractId, contract)
    console.log('siteId',state.siteId)
    return <RForm<Item>
            formRef={formRef}
            layout={'horizontal'}
            {
                ...layoutProps
            }
            readonly={false}
            initialValues={initialValues}
            onValuesChange={(_, values) => {
                console.log(values);
                setState({...state, ...values})
                onItemChange({...state, ...values})
            }}
            onFinish={async (values) => {
                console.log('onFinish',values)
                console.log('state', state)
                debugger
                onSubmit(state);
                history.goBack()
            }
            }
            submitter={{
                render: (props) => null
            }}
        >
            <ProFormSelect readonly={true} showSearch={true} label={'Заказчик'} placeholder={'Выберите заказчика'}  required={true} valueEnum={brandsOptions} name={'brandId'}  rules={[{required: true}]}/>
        {/*<ProForm.Item label={'Организация'}>
            <Text></Text>
        </ProForm.Item>
        */}<ProFormSelect readonly={true} disabled={state.brandId === undefined} label={'Организация'} placeholder={'Выберите организацию'}   required={true} valueEnum={legalsOptions} name={'legalId'}  rules={[{required: true}]}/>

            <ProFormSelect readonly={true} showSearch={true} disabled={state.legalId === undefined} label={'Адрес'} placeholder={'Выберите адрес'}   required={true} valueEnum={sitesOptions} name={'siteId'} rules={[{required: true}]}/>
            <Form.Item name="contractId" label="Договор">
                {
                    contract
                        ?  <Text type="success">{contract.contractNumber}</Text>
                        : <Text type="warning">Договор не найден</Text>

                }
            </Form.Item>
            <ProFormDatePicker readonly={true} {...fieldMetaToProProps(ISSUES, 'registerDate', state) } label={'Заявка зарегистрирована'}  width={'sm'} />
            <ProFormDatePicker {...fieldMetaToProProps(ISSUES, 'plannedDate', state)} label={"Плановая дата"}  width={'sm'} />
            <ProFormDatePicker {...fieldMetaToProProps(ISSUES, 'workStartedDate', state)} label={'Дата начала работ'}  width={'sm'} />
            <ProFormDatePicker {...fieldMetaToProProps(ISSUES, 'completedDate', state)} label={'Дата завершения'}  width={'sm'} />
            <ProFormTextArea {...fieldMetaToProProps(ISSUES, 'description')} rules={[{required:true}]}/>
            <ProFormSelect label={'Статус'} name={'status'} width={'sm'} valueEnum={{'Новая':'Новая','В работе':'В работе','Выполнена':'Выполнена','Отменена':'Отменена'}} placeholder={'Статус не указан'} />
           <ProFormCheckbox {...fieldMetaToProProps(ISSUES,'estimationsApproved')} />
            <ProFormText {...fieldMetaToProProps(ISSUES,'expensePrice')} readonly={true}  />
            <ProFormText {...fieldMetaToProProps(ISSUES,'estimationPrice')} readonly={true} />
        <Form.Item name="contractId" label="прибыль">
            {
                state.estimationPrice - state.expensePrice

            }
        </Form.Item>
        <Form.Item name="contractId" label="Маржинальность">
            {
                ( state.estimationPrice && state.expensePrice)
                    ? (((state.estimationPrice - state.expensePrice) / state.estimationPrice).toFixed(2) + '%')
                    : "-"
            }
        </Form.Item>
    </RForm>

}