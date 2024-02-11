import {ProFormInstance, ProFormSelect, ProFormText, ProFormTextArea} from '@ant-design/pro-components'
import {Breadcrumb, Button, Form, Typography} from 'antd'
import React, {useRef, useState} from 'react'

import {generateGuid, sleep} from '@shammasov/utils'
import {useQueryObject} from '../../../hooks/useQueryObject'
import {useDispatch, useSelector} from 'react-redux'
import {useHistory} from 'react-router'
import {AntdIcons} from '../../elements/AntdIcons'
import AppLayout from '../../app/AppLayout'
import CancelButton from '../../elements/CancelButton'
import getCrudPathname from '../../../hooks/getCrudPathname'
import {RForm} from '../../elements/RForm'
import {fieldMetaToProProps} from '../chapter-routed/ItemChapter'
import {BRANDS, BrandVO, CONTRACTS, ContractVO, Days, LEGALS, SITES, SiteVO, SUBS, SubVO, TICKETS, TicketVO} from 'iso'
import RenFormDate from "../../form/RenFormDate";
import {getNav} from "../../getNav";
import useCurrentUser from "../../../hooks/useCurrentUser";


const { Text, Link } = Typography;
export default () => {

    const {currentUser} = useCurrentUser()
    const layoutProps = {
        labelCol: { span: 6 },
        wrapperCol: { span:18 },
    }
    const resource = TICKETS
    const formRef = useRef<
        ProFormInstance<TicketVO>
    >();

    type Item = TicketVO
    const id =generateGuid()
    const predefinedValues = useQueryObject<TicketVO>()
    const initialPlannedDate = ( Days.today().add(3,'day'))
    const initialValues:TicketVO = {id,
        ...predefinedValues,checkFiles: [],
        actFiles: [],
        workFiles: [],
        responsibleManagerId: currentUser.id,
        status: 'Новая',
        expensePrice: 0,estimationPrice: 0, expenses: [], estimations: [],
        plannedDate: initialPlannedDate.toString(),
        registerDate: Days.today()
    }
    const [state, setState] = useState(initialValues) as any as [Item, (otem: Item)=>any]
    const dispatch = useDispatch()

    const onSubmit = async (values: Item) => {
        const patch = {id, ...values,}
        const action = TICKETS.actions.added(patch)
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


    const brands: BrandVO[] = useSelector(BRANDS.selectors.selectAll) as any
    const brandsOptions = BRANDS.asValueEnum(brands)
    const legals = useSelector(LEGALS.selectors.selectAll)
    const [legalsOptions, setLegalOptions]= useState({})
    const sites: SiteVO[] = useSelector(SITES.selectors.selectAll)
    const [sitesOptions, setSitesOptions]= useState({})
    const onBrandChange = (e) => {
        formRef.current?.setFieldValue('legalId', undefined)
        formRef.current?.setFieldValue('siteId', undefined)
        const brandId = formRef.current?.getFieldValue('brandId')
        const legOpts=LEGALS.asValueEnum(legals.filter(l => l.brandId === brandId))
        setLegalOptions(legOpts)
        console.log('onBrandChange',e, legOpts)
    }

    const onLegalChange = (e) => {
        formRef.current?.setFieldValue('siteId', undefined)

        const legalId = formRef.current?.getFieldValue('legalId')
        const sitesOpts=SITES.asValueEnum(sites.filter(l => l.legalId === legalId))
        setSitesOptions(sitesOpts)
        console.log('onLegalChange',e, sitesOpts)
    }

    const contracts: ContractVO[] = useSelector(CONTRACTS.selectors.selectAll)
    const subs: SubVO[] = useSelector(SUBS.selectors.selectAll)
    const sub = subs.find(s => s.siteId === state.siteId) || {} as SubVO
    const contract = contracts.find(c => c.id === state.contractId )
    const onSiteChange = (e) => {
        const siteId = formRef.current?.getFieldValue('siteId')
        const site = sites.find(s => s.id === siteId) || {} as SiteVO
        const sub = subs.find(s => s.siteId === siteId) || {} as SubVO
        const contract = contracts.find(c => c.id === sub.contractId )
        if(sub && contract && site) {
            formRef.current?.setFieldValue('contractId',contract.id)
            formRef.current?.setFieldValue('subId',sub.id)
            setState({...state, contractId: contract.id, subId: sub.id,contactInfo:site.contactInfo, clientsEngineerUserId: site.clientsEngineerUserId })
        }
    }
    console.log('contractId', state.contractId, contract)
    console.log('siteId',state.siteId)
    const buildDate = (name: keyof TicketVO) => {
        return        <RenFormDate {...fieldMetaToProProps(TICKETS, name, state)}
                                   value={state[name]}
                                   onValueChange={e => {
                                       const newItem ={...state,[name]:e}
                                       setState(newItem)

                                   }}
                                   label={TICKETS.attributes[name].headerName} width={'sm'}
        />
    }
    return  <AppLayout
        proLayout={{
            extra:[
                <CancelButton onCancel={onBack}/>,
                <Button type={'primary'} icon={<AntdIcons.SaveOutlined/>} onClick={onSave} disabled={!(state.siteId && contract && contract.contractId)}>Создать</Button>
            ],
            title:'Rengin',
        }}
        onBack={onBack}

        title={<Breadcrumb items={ [   {
            href: getCrudPathname(resource).view(),

            title: resource.langRU.plural
        },
            {
                title,
            }]} ></Breadcrumb>
        }
    >
        <RForm<Item>
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
            }}
            onFinish={async (values) => {
                console.log('onFinish',values)
                console.log('state', state)
                debugger
                onSubmit(state);
                await sleep(100)
                history.replace(getNav().issuesEdit({id}))
            }
            }
            submitter={{
                render: (props) => null
            }}
        >
            <ProFormText {...fieldMetaToProProps(TICKETS, 'clientsIssueNumber')} required={true} placeholder={'Введите номер заявки'} rules={[{required:true}]}/>

            <ProFormSelect showSearch={true} label={'Заказчик'} placeholder={'Выберите заказчика'}  required={true} valueEnum={brandsOptions} name={'brandId'}  onChange={onBrandChange} rules={[{required: true}]}/>
            <ProFormSelect showSearch={true} disabled={state.brandId === undefined} label={'Организация'} placeholder={'Выберите организацию'}  required={true} valueEnum={legalsOptions} name={'legalId'}  onChange={onLegalChange} rules={[{required: true}]}/>
            <ProFormSelect showSearch={true} disabled={state.legalId === undefined} label={'Адрес'} placeholder={'Выберите адрес'}   required={true} valueEnum={sitesOptions} name={'siteId'}  onChange={onSiteChange} rules={[{required: true}]}/>
            <Form.Item name="contractId" label="Договор">
                {

                          contract?  <Text type="success">{contract.contractNumber}</Text>
                              :
                        <Text type="warning">Договор не найден</Text>

                }
            </Form.Item>
            {
                buildDate('registerDate')
            }
            {
                buildDate('plannedDate')
            }
            { buildDate('workStartedDate')}
            {buildDate('completedDate')}
            <ProFormTextArea {...fieldMetaToProProps(TICKETS, 'description')}/>
        </RForm>

    </AppLayout>
}