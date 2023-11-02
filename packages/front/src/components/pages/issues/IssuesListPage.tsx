import {useAllColumns} from '../../../grid/RCol'
import useLedger from '../../../hooks/useLedger'
import PanelRGrid from '../../../grid/PanelRGrid'
import {ISSUES, IssueVO} from 'iso/src/store/bootstrap/repos/issues'
import AppLayout from '../../app/AppLayout'
import React, {useState} from 'react'
import {RowClassParams} from "ag-grid-community/dist/lib/entities/gridOptions";
import {DateTime} from "luxon";
import {ColDef} from "ag-grid-community";
import {Badge, Tag} from "antd";
import {NewValueParams} from "ag-grid-community/dist/lib/entities/colDef";
import {useDispatch, useSelector} from "react-redux";
import useCurrentUser from "../../../hooks/useCurrentUser";
import useRouteProps from "../../../hooks/useRouteProps";
import {useRouteMatch} from "react-router";
import IssueModal from "./IssueModal";
import dayjs from "dayjs";
import {matchesTreeDataDisplayType} from "ag-grid-community/dist/lib/gridOptionsValidator";


const getEstimationApprovedTag = (data: IssueVO) =>
    data.estimationsApproved === true
        ? <Tag color={'green'}>Да</Tag>
        : <Tag color={'red'}>Нет</Tag>

const getStatusTag = (issue: IssueVO) => {
    const currentDJ = dayjs()
    const plannedDJ =issue.plannedDate ? dayjs(issue.plannedDate) : undefined
    const completedDJ = issue.completedDate ? dayjs(issue.completedDate) : undefined

    const workStartedDJ =  issue.workStartedDate ? dayjs(issue.workStartedDate) : undefined
    const registerDJ = issue.registerDate ? dayjs(issue.registerDate) : undefined
    const getTag = () => {

        if (issue.status === 'Приостановлена')
            return <Tag color="grey">{issue.status}</Tag>
        if (issue.status === 'В работе')
            return <Tag color="yellow">{issue.status}</Tag>
        if (issue.status === 'Выполнена')
            return <Tag color="green">{issue.status}</Tag>
        return <Tag color="blue">{issue.status}</Tag>
    }
    const tag = getTag()
    if(issue.status === 'В работе') {
        if(currentDJ.isAfter(plannedDJ))
        return <Badge count={currentDJ.diff(plannedDJ,'d')} offset={[-2,5]}>{tag}</Badge>
    }
    return tag
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
         const plannedDayjs = dayjs(params.data.plannedDate)
        const completedDayjs = dayjs(params.data.completedDate)

        const workStartedDayjs = dayjs(params.data.workStartedDate)
        const registerDayjs = dayjs(params.data.registerDate)
        const now = dayjs()
       /* if ( !params.data.completedDate  && params.data.plannedDate  && now.isAfter(dayjs(plannedDayjs))){//params.data..rowIndex % 2 === 0) {
            return { background: 'yellow' };
        }
        if(params.data.completedDate &&  params.data.plannedDate  && completedDayjs.isAfter(dayjs(plannedDayjs)))
*/
        return {background: undefined}
    };
    const [cols,colMap] = useAllColumns(ISSUES)

    const columns: ColDef<IssueVO>[] = [
        {...colMap.clickToEditCol, headerName:'Номер'},
        {
            field: 'status',
            headerName: 'Статус',
            width: 105,
            cellEditor: 'agSelectCellEditor',
            editable: currentUser.role !== 'сметчик',
            onCellValueChanged: (event: NewValueParams<IssueVO, IssueVO['status']> ) => {
                const issue: Partial<IssueVO> = {issueId: event.data.issueId, status: event.newValue}
                if(event.newValue === 'Выполнена')
                    issue.completedDate = dayjs().startOf('d').toISOString()

                dispatch(ISSUES.actions.patched(issue))
            },
            cellEditorParams: {

                values: ['Новая','В работе','Выполнена','Отменена','Приостановлена'],
                valueListGap: 0,
            },
            cellRenderer: (props:{rowIndex:number}) =>
                getStatusTag(props.data)
        },
        {...colMap.brandId, width: 65},
        {...colMap.siteId, width: 170},
        {...colMap.description, width: 260},
        {...colMap.plannedDate,headerName:'План'},
        {...colMap.completedDate,headerName:'Завершена'},
        {...colMap.estimationsApproved,
            headerName:'Смета',
            cellRenderer: (props) =>
                getEstimationApprovedTag(props.data)
            , width: 80
        },
        {...colMap.estimationPrice, editable: false, width: 80},
        {...colMap.expensePrice,editable: false, width: 80},
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