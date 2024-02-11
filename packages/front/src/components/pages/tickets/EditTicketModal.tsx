import {useDispatch, useSelector} from 'react-redux'
import React, {useState} from 'react'
import {ProCard} from '@ant-design/pro-components'
import {useHistory} from 'react-router'
import {AntdIcons} from '../../elements/AntdIcons'
import {Button, Modal, UploadFile} from 'antd'
import DeleteButton from '../../elements/DeleteButton'
import CancelButton from '../../elements/CancelButton'
import EditIssueItemForm from 'front/src/components/pages/tickets/tabs/EditTicketFormTab'
import {SITES, SiteVO, SUBS, SubVO, TICKETS, TicketVO} from 'iso'
import ExpensesTable from "front/src/components/pages/tickets/tabs/ExpensesTable"
import UploadSection from "../../elements/UploadSection"
import EstimationsTable from "front/src/components/pages/tickets/tabs/EstimationsTable"
import {IssueStateContext} from "../../../contexts/useTicket"
import {sleep} from "@shammasov/utils"
import {useFrontStateSelector} from "../../../hooks/common/useFrontSelector";

export default ({id}: {id: string}) => {
    const resource = TICKETS
    const state = useFrontStateSelector()
    const initialValues:TicketVO =useSelector(TICKETS.selectors.selectById(id))

    const [ticketState, setTicketState] = useState(initialValues as TicketVO) as any as [TicketVO, (otem: TicketVO)=>any]

    const setIssueProperty = <K extends keyof TicketVO>(prop: K) => (value: TicketVO[K]) => {
        console.log('set property ', prop, value)
        setTicketState({...ticketState, [prop]: value})
    }
    
    const dispatch = useDispatch()
    const history = useHistory()

    const getFilesProps = (listName: 'workFiles'|'checkFiles'|'actFiles',label: string, maxCount = 1) => {
        return {
            items: ticketState[listName] as any as UploadFile[],
            onItemsChange: (list:UploadFile[]) => {
                setTicketState({...ticketState, [listName]:list})
            },
            issueId: initialValues.id,
            label,
            maxCount,

        }
    }

    const title = resource.getItemName(ticketState)

    const onSave = () =>{
        if(JSON.stringify(initialValues) !== JSON.stringify(ticketState))
            dispatch(resource.actions.updated({id:ticketState.id,changes:ticketState}))
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

    const issue = useSelector(TICKETS.selectors.selectById(id))

    const sub: SubVO = useSelector(SUBS.selectors.selectById(issue.subId))
    const site: SiteVO = useSelector(SITES.selectors.selectById(sub.siteId))

    return   <IssueStateContext.Provider value={{
        issue: ticketState,
        setIssue: setTicketState,
        setIssueProperty
    }}> <Modal
        width={'80%'}
        style={{top:"20px"}}
        title={TICKETS.getIssueTitle(ticketState)(state)}
        open={true}
        onOk={onOk}
        footer={[
            <DeleteButton resource={resource} id={id} onDeleted={onDelete}/>,
            <CancelButton onCancel={onBack}  disabled={JSON.stringify(initialValues) === JSON.stringify(ticketState)} />,
            <Button type={'primary'} disabled={JSON.stringify(initialValues) === JSON.stringify(ticketState)}  icon={<AntdIcons.SaveOutlined/>} onClick={onSave}>Сохранить</Button>
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

