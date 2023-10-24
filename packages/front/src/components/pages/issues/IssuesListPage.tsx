import {useAllColumns} from '../../../grid/RCol'
import useLedger from '../../../hooks/useLedger'
import PanelRGrid from '../../../grid/PanelRGrid'
import {ISSUES, IssueVO} from 'iso/src/store/bootstrap/repos/issues'
import AppLayout from '../../app/AppLayout'
import React, {useState} from 'react'
import {RowClassParams} from "ag-grid-community/dist/lib/entities/gridOptions";
import {DateTime} from "luxon";
import {ColDef} from "ag-grid-community";
import {Tag} from "antd";
import {NewValueParams} from "ag-grid-community/dist/lib/entities/colDef";
import {useDispatch, useSelector} from "react-redux";
import useCurrentUser from "../../../hooks/useCurrentUser";
import useRouteProps from "../../../hooks/useRouteProps";
import {useRouteMatch} from "react-router";
import IssueModal from "./IssueModal";


const getEstimationApprovedTag = (data: IssueVO) =>
    data.estimationsApproved === true
        ? <Tag color={'green'}>Да</Tag>
        : <Tag color={'red'}>Нет</Tag>

const getStatusTag = (issue: IssueVO) => {
    const currentISO = new Date().toISOString()
    const plannedDateTime = DateTime.fromISO(issue.plannedDate)
    const completedDateTime = DateTime.fromISO(issue.completedDate)

    const workStartedDateTime = DateTime.fromISO(issue.workStartedDate)
    const registerDateTime = DateTime.fromISO(issue.registerDate)
    if(!issue.status || issue.status === 'В работе')
        if (!issue.completedDate && new Date(issue.plannedDate).toISOString() < currentISO){//params.data..rowIndex % 2 === 0) {

            return <Tag color="red">Просрочено</Tag>
        }
    if(issue.status === 'Приостановлена')
        return <Tag color="grey">{issue.status}</Tag>
    if(issue.status === 'В работе')
        return <Tag color="yellow">{issue.status}</Tag>
    if(issue.status === 'Выполнена')
        return <Tag color="green">{issue.status}</Tag>
    return <Tag color="blue">{issue.status}</Tag>
}
export default () => {

    const routeMatch = useRouteMatch<{issueId:string}>()
    const allIssues: IssueVO[] = useSelector(ISSUES.selectAll)
    const {currentUser} = useCurrentUser()
    const ledger = useLedger()
    const rowData = currentUser.role === 'менеджер'
        ? allIssues.filter(i => i.responsibleManagerId === currentUser.userId)
        : allIssues

    const dispatch = useDispatch()
    const onCreateClick = (defaults) => {
        console.log(defaults)
    }
    console.log("Render IssuesList")

    const getRowStyle = (params:RowClassParams<IssueVO>) => {
        console.log('getRowStyle params ', params)
       const currentISO = new Date().toISOString()
         const plannedDateTime = DateTime.fromISO(params.data.plannedDate)
        const completedDateTime = DateTime.fromISO(params.data.completedDate)

        const workStartedDateTime = DateTime.fromISO(params.data.workStartedDate)
        const registerDateTime = DateTime.fromISO(params.data.registerDate)
        if (!params.data.completedDate && plannedDateTime){//params.data..rowIndex % 2 === 0) {
            return { background: 'red' };
        }

        return {background: undefined}
    };
    const [cols,colMap] = useAllColumns(ISSUES)

    const columns: ColDef<IssueVO>[] = [
        colMap.clickToEditCol,
        colMap.clientsIssueNumber,
        {
            field: 'status',
            headerName: 'Статус',
            width: 90,
            cellEditor: 'agSelectCellEditor',
            editable: currentUser.role !== 'сметчик',
            onCellValueChanged: (event: NewValueParams<IssueVO, IssueVO['status']> ) => {
                dispatch(ISSUES.actions.patched({issueId: event.data.issueId, status: event.newValue}))
            },
            cellEditorParams: {
                values: ['Новая','В работе','Выполнена','Отменена','Приостановлена'],
                valueListGap: 0,
            },
            cellRenderer: (props:{rowIndex:number}) =>
                getStatusTag(props.data)
        },
        colMap.brandId,
        colMap.legalId,
        colMap.contractId,
        colMap.siteId,
        colMap.status,
        colMap.completedDate,
        colMap.plannedDate,
        {...colMap.estimationsApproved,
            headerName:'Согласована',
            cellRenderer: (props) =>
                getEstimationApprovedTag(props.data)
        },
        {...colMap.estimationPrice, editable: false},
        {...colMap.expensePrice,editable: false},
    ]
            return  <AppLayout
                hidePageContainer={true}
                proLayout={{contentStyle:{
                        padding: '0px'
                    }
                }}
            >
                <div>
                    {
                        routeMatch.params.issueId ? <IssueModal issueId={routeMatch.params.issueId} /> : null
                    }


                    <PanelRGrid
                        rowData={rowData}
                        getRowStyle={getRowStyle}
                        onCreateClick={onCreateClick}
                        fullHeight={true}
                        resource={ISSUES}
                        columnDefs={columns}
                        title={'Все заявки'}
                    />
                    {
                        /**
                         <FooterToolbar extra="extra information">
                     <Button>Cancel</Button>
                     <Button type="primary">Submit</Button>
                     </FooterToolbar>
                         */
                    }</div>

            </AppLayout>

}