import {useDispatch, useSelector} from 'react-redux'
import React, {useReducer, useRef, useState} from 'react'
import AppLayout from '../../app/AppLayout'
import {ProCard, ProFormInstance} from '@ant-design/pro-components'
import getCrudPathname from '../../../hooks/getCrudPathname'
import {useHistory} from 'react-router'
import {AntdIcons} from '../../elements/AntdIcons'
import {Breadcrumb, Button, UploadFile} from 'antd'
import DeleteButton from '../../elements/DeleteButton'
import CancelButton from '../../elements/CancelButton'
import usePathnameResource from '../../../hooks/usePathnameResource'
import EditIssueItemForm from './tabs/EditIssueFormTab'
import {ISSUES, IssueVO} from 'iso/src/store/bootstrap/repos/issues'
import ExpensesTable from "./tabs/ExpensesTable";
import UploadSection from "../../elements/UploadSection";
import EstimationsTable from "./tabs/EstimationsTable";
import {issueEditReducer, IssueStateContext} from "../../../contexts/useIssue";
import {currentIssueDuck} from "../../../store/ducks/currentIssueDuck";
import {sleep} from "@sha/utils";
import {useUnmount} from "react-use";

export default () => {
    const {resource,id,item,verb} = usePathnameResource()
    useUnmount(() => {})
    type Item = typeof resource.exampleItem

    const initialValues:IssueVO =useSelector(ISSUES.selectById(id))

    const [issueState, setIssueState] = useState(initialValues as IssueVO) as any as [IssueVO, (otem: IssueVO)=>any]

    const setIssueProperty = <K extends keyof IssueVO>(prop: K) => (value: IssueVO[K]) => {
        console.log('set property ', prop, value)
        setIssueState({...issueState, [prop]: value})
    }
    const idProp = resource.idProp
    const dispatch = useDispatch()
    const history = useHistory()

    const trimUploadedFile = (file: UploadFile) =>
        ({name:file.name, url: file.response.url,preview: file.preview})
    const getFilesProps = (listName: 'workFiles'|'checkFiles'|'actFiles',label: string, maxCount = 1) => {
        return {
            items: issueState[listName],
            onItemsChange: (list) => {
                setIssueState({...issueState,
                    [listName]:list.map(trimUploadedFile)
                });
            },
            issueId: initialValues.issueId,
            label,
            maxCount,

    }

    const title = resource.getItemName(issueState)
    const onSave = () => {
        //const { expenses,expensePrice,estimationPrice,estimations, ...rest} = issueState
        dispatch(resource.actions?.patched(issueState))
        onBack()
    }
    const onDelete = async () => {
        onBack()
        await sleep(100)
        dispatch(resource.actions.removed(id))

    }

    const onBack = () =>
        history.goBack()
    const issue = useSelector(currentIssueDuck.selectCurrentIssue)

    return  <IssueStateContext.Provider value={{
        issue: issueState,
        setIssue: setIssueState,
        setIssueProperty
    }}><AppLayout
        proLayout={{
            extra:[
                <CancelButton onCancel={onBack}/>,
                <DeleteButton  resource={resource} id={id} onDeleted={onDelete}/>,
                <Button disabled={JSON.stringify(initialValues) === JSON.stringify(issueState)} type={'primary'} icon={<AntdIcons.SaveOutlined/>} onClick={onSave}>Сохранить</Button>
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
                <EditIssueItemForm />
            </ProCard.TabPane>
             <ProCard.TabPane key="tab2" tab={"Смета"}>
                <EstimationsTable/>
            </ProCard.TabPane>
            <ProCard.TabPane key="tab3" tab={"Расходы"}>
                <ExpensesTable/>
            </ProCard.TabPane>
            <ProCard.TabPane key="tab4" tab={"Файлы"}>
                    <UploadSection {...getFilesProps('checkFiles','Чеки',10)}/>
                    <UploadSection {...getFilesProps('actFiles','Акты',5)}/>
                    <UploadSection {...getFilesProps('workFiles','Работы',70)}/>
            </ProCard.TabPane>
            {
                /*
            <ProCard.TabPane key="tab5" tab={"История"}>

            </ProCard.TabPane>

                 */
            }
        </ProCard>



    </AppLayout>
    </IssueStateContext.Provider>
}

