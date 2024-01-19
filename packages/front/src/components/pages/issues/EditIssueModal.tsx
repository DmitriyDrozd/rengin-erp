import {useDispatch, useSelector} from 'react-redux'
import React, {useState} from 'react'
import {ProCard} from '@ant-design/pro-components'
import {useHistory} from 'react-router'
import {AntdIcons} from '../../elements/AntdIcons'
import {Button, Modal} from 'antd'
import DeleteButton from '../../elements/DeleteButton'
import CancelButton from '../../elements/CancelButton'
import EditIssueItemForm from './tabs/EditIssueFormTab'
import {ISSUES, IssueVO} from 'iso/src/store/bootstrap/repos/issues'
import ExpensesTable from "./tabs/ExpensesTable"
import UploadSection from "../../elements/UploadSection"
import EstimationsTable from "./tabs/EstimationsTable"
import {IssueStateContext} from "../../../contexts/useIssue"
import {sleep} from "@sha/utils"
import {SITES} from "iso/src/store/bootstrap"
import {SiteVO} from "iso/src/store/bootstrap/repos/sites"
import {SUBS, SubVO} from "iso/src/store/bootstrap/repos/subs";

export default ({id}: {id: string}) => {
    const resource = ISSUES
    const issueId1 = id
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

    const getFilesProps = (listName: 'workFiles'|'checkFiles'|'actFiles',label: string, maxCount = 1) => {
        return {
            items: issueState[listName],
            onItemsChange: (list) => {
                setIssueState({...issueState, [listName]:list})
            },
            issueId: initialValues.issueId,
            label,
            maxCount,

        }
    }

    const title = resource.getItemName(issueState)

    const onSave = () =>{
        if(JSON.stringify(initialValues) !== JSON.stringify(issueState))
            dispatch(resource.actions?.patched(issueState))
        onBack()
    }

    const onDelete = async () => {
        onBack()
        await sleep(100)
        dispatch(resource.actions.removed(id))
    }

    const onBack = () => {
        history.goBack()
    }

    const onCancel = () => {
        onSave()
    }

    const onOk = () => {
        debugger
    }

    const issue = useSelector(ISSUES.selectById(id))

    const sub: SubVO = useSelector(SUBS.selectById(issue.subId))
    const site: SiteVO = useSelector(SITES.selectById(sub.siteId))

    return   <IssueStateContext.Provider value={{
        issue: issueState,
        setIssue: setIssueState,
        setIssueProperty
    }}> <Modal
        width={'80%'}
        style={{top:"20px"}}
        title={ISSUES.getIssueTitle(issueState)}
        open={true}
        onOk={onOk}
        footer={[
            <DeleteButton resource={resource} id={id} onDeleted={onDelete}/>,
            <CancelButton onCancel={onBack}  disabled={JSON.stringify(initialValues) === JSON.stringify(issueState)} />,
            <Button type={'primary'} disabled={JSON.stringify(initialValues) === JSON.stringify(issueState)}  icon={<AntdIcons.SaveOutlined/>} onClick={onSave}>Сохранить</Button>
        ]}
        onCancel={onCancel}
    >
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

        </ProCard>
    </Modal>
    </IssueStateContext.Provider>

}

