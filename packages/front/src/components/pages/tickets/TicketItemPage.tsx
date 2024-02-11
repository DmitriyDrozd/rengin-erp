import {useDispatch, useSelector} from 'react-redux'
import React, {useState} from 'react'
import AppLayout from '../../app/AppLayout'
import {ProCard} from '@ant-design/pro-components'
import getCrudPathname from '../../../hooks/getCrudPathname'
import {useHistory} from 'react-router'
import {AntdIcons} from '../../elements/AntdIcons'
import {Breadcrumb, Button, UploadFile} from 'antd'
import DeleteButton from '../../elements/DeleteButton'
import CancelButton from '../../elements/CancelButton'
import usePathnameResource from '../../../hooks/usePathnameResource'
import EditIssueItemForm from '../../pages/tickets/tabs/EditTicketFormTab'
import {TICKETS, TicketVO} from 'iso'
import ExpensesTable from "../../pages/tickets/tabs/ExpensesTable";
import UploadSection from "../../elements/UploadSection";
import EstimationsTable from "../../pages/tickets/tabs/EstimationsTable";
import {IssueStateContext} from "../../../contexts/useTicket";
import {sleep} from "@shammasov/utils";
import {useUnmount} from "react-use";

export default () => {
    const {resource,id,item,verb} = usePathnameResource()
    useUnmount(() => {})

    const initialValues:TicketVO = useSelector(TICKETS.selectors.selectById(id))

    const [ticketState, setTicketState] = useState(initialValues as TicketVO) as any as [TicketVO, (otem: TicketVO)=>any]

    const setIssueProperty = <K extends keyof TicketVO>(prop: K) => (value: TicketVO[K]) => {
        console.log('set property ', prop, value)
        setTicketState({...ticketState, [prop]: value})
    }

    const dispatch = useDispatch()
    const history = useHistory()

    const trimUploadedFile = (file: UploadFile) =>
        ({name:file.name, url: file.response.url,preview: file.preview})
    const getFilesProps = (listName: 'workFiles'|'checkFiles'|'actFiles',label: string, maxCount = 1) => {
        return {
            items: ticketState[listName],
            onItemsChange: (list) => {
                setTicketState({...ticketState,
                    [listName]:list.map(trimUploadedFile)
                });
            },
            issueId: initialValues.issueId,
            label,
            maxCount,

    }

    const title = resource.getItemName(ticketState)
    const onSave = () => {
        //const { expenses,expensePrice,estimationPrice,estimations, ...rest} = ticketState
        dispatch(resource.actions?.patched(ticketState))
        onBack()
    }
    const onDelete = async () => {
        onBack()
        await sleep(100)
        dispatch(resource.actions.removed(id))
    }

    const onBack = () =>
        history.goBack()

    return  <IssueStateContext.Provider value={{
        issue: ticketState,
        setIssue: setTicketState,
        setIssueProperty
    }}><AppLayout
        proLayout={{
            extra:[
                <CancelButton onCancel={onBack}/>,
                <DeleteButton  resource={resource} id={id} onDeleted={onDelete}/>,
                <Button disabled={JSON.stringify(initialValues) === JSON.stringify(ticketState)} type={'primary'} icon={<AntdIcons.SaveOutlined/>} onClick={onSave}>Сохранить</Button>
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

