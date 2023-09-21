
import {useAllColumns} from '../../../grid/RCol'
import useLedger from '../../../hooks/useLedger'
import PanelRGrid from '../../../grid/PanelRGrid'
import {ISSUES, IssueVO} from 'iso/src/store/bootstrap/repos/issues'
import AppLayout from '../../app/AppLayout'
import React from 'react'
import {RowClassParams} from "ag-grid-community/dist/lib/entities/gridOptions";
import {DateTime} from "luxon";
import {ColDef} from "ag-grid-community";
import {Button, Tag} from "antd";
import {remove} from "ramda";


export default () => {
    const ledger = useLedger()

    const onCreateClick = (defaults) => {
        console.log(defaults)
    }
    console.log("Render IssuesList")
    const getTag = (issue: IssueVO) => {
        const currentISO = new Date().toISOString()
        const plannedDateTime = DateTime.fromISO(issue.plannedDate)
        const completedDateTime = DateTime.fromISO(issue.completedDate)

        const workStartedDateTime = DateTime.fromISO(issue.workStartedDate)
        const registerDateTime = DateTime.fromISO(issue.registerDate)
        if(!issue.status || issue.status === 'В работе')
        if (!issue.completedDate && new Date(issue.plannedDate).toISOString() < currentISO){//params.data..rowIndex % 2 === 0) {

           debugger
            return <Tag color="red">Просрочено</Tag>
        }

        if(issue.status === 'В работе')
            return <Tag color="yellow">{issue.status}</Tag>
        if(issue.status === 'Выполнена')
            return <Tag color="green">{issue.status}</Tag>
        return <Tag color="blue">{issue.status}</Tag>
    }
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

    const columns: ColDef<IssueVO>[] = [colMap.clickToEditCol,
        colMap.clientsIssueNumber,
        {
            field: 'plannedDate',
            headerName: 'Выполнение',
            cellRenderer: (props:{rowIndex:number}) =>
                getTag(props.data)

        },

        colMap.brandId,
        colMap.legalId,
        colMap.contractId,
        colMap.siteId,
        colMap.completedDate,
        colMap.plannedDate,
        colMap.status,
        colMap.estimationPrice,
        colMap.expensePrice,
    ]
            return  <AppLayout
                hidePageContainer={true}
                proLayout={{contentStyle:{
                        padding: '0px'
                    }
                }}
            >
                <div>



                    <PanelRGrid
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