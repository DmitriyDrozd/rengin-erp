import {useDispatch, useSelector} from 'react-redux'
import React, {useRef, useState} from 'react'
import AppLayout from '../../app/AppLayout'
import {ProCard, ProFormInstance} from '@ant-design/pro-components'
import getCrudPathname from '../../../hooks/getCrudPathname'
import {useHistory} from 'react-router'
import {AntdIcons} from '../../elements/AntdIcons'
import {Breadcrumb, Button} from 'antd'
import DeleteButton from '../../elements/DeleteButton'
import CancelButton from '../../elements/CancelButton'
import usePathnameResource from '../../../hooks/usePathnameResource'
import EditIssueItemForm from './EditIssueItemForm'
import {ISSUES, IssueVO} from 'iso/src/store/bootstrap/repos/issues'
import ExpensesTable from "./ExpensesTable";
import UploadSection from "../../elements/UploadSection";
import EstimationsTable from "./EstimationsTable";


export default () => {
    const {resource,id,item,verb} = usePathnameResource()
    type Item = typeof resource.exampleItem
    const formRef = useRef<
        ProFormInstance<Item>
    >();


    const initialValues:IssueVO =useSelector(ISSUES.selectById(id))
    const [state, setState] = useState(initialValues) as any as [IssueVO, (otem: IssueVO)=>any]

    const idProp = resource.idProp
    const dispatch = useDispatch()
    const history = useHistory()

    const getFilesProps = (listName: 'workFiles'|'checkFiles'|'actFiles',label: string, maxCount = 1) => {
        return {
            items: state[listName],
            onItemsChange: (list) => {
                setState({...state, [listName]:list})
            },
            issueId: initialValues.issueId,
            label,
            maxCount,

        }
    }



    const onSubmit = async (values: Item) => {

        const patch = {...initialValues, ...values,[idProp]:id};
        const action = resource.actions.patched(patch, initialValues)
        console.log('Submit', values, action)
        history.goBack()
        if(action)
            dispatch(action)

        //            dispatch(BRANDS.actions.added(values))
    }

    const title = resource.getItemName(state)
    const onSave = () => {
        const { expenses,expensePrice,estimationPrice,estimations, ...rest} = state
        dispatch(resource.actions?.patched(rest))
        onBack()
    }
    const onDelete = () => {
        dispatch(resource.actions.removed(id))
        onBack()
    }

    const onBack = () =>
        history.goBack()
    return  <AppLayout
        proLayout={{
            extra:[
                <CancelButton onCancel={onBack}/>,
                <DeleteButton  resource={resource} id={id} onDeleted={onDelete}/>,
                <Button type={'primary'} icon={<AntdIcons.SaveOutlined/>} onClick={onSave}>Сохранить</Button>
            ],
            title:'Rengin'
        }}
        onBack={onBack}

        title={<Breadcrumb items={ [   {
            href: getCrudPathname(resource).view(),

            title: resource.langRU.plural
        },
            {
                title,
            }]} ></Breadcrumb>
        }>
        <ProCard
            tabs={{
                type: 'card',
            }}
        >
            <ProCard.TabPane key="tab1" tab="Заявка">
                <EditIssueItemForm issueId={id} />
            </ProCard.TabPane>
            <ProCard.TabPane key="tab2" tab={"Смета"}>
                <EstimationsTable issueId={id}/>
            </ProCard.TabPane>
            <ProCard.TabPane key="tab3" tab={"Расходы"}>
                <ExpensesTable issueId={id} />
            </ProCard.TabPane>
            <ProCard.TabPane key="tab4" tab={"Файлы"}>
                    <UploadSection {...getFilesProps('checkFiles','Чек',1)}/>
                    <UploadSection {...getFilesProps('actFiles','Акты',5)}/>
                    <UploadSection {...getFilesProps('workFiles','Работы',70)}/>
            </ProCard.TabPane>
            <ProCard.TabPane key="tab5" tab={"История"}>

            </ProCard.TabPane>
        </ProCard>



    </AppLayout>
}

