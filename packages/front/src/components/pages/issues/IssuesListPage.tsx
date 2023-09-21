
import {useAllColumns} from '../../../grid/RCol'
import useLedger from '../../../hooks/useLedger'
import PanelRGrid from '../../../grid/PanelRGrid'
import {ISSUES, IssueVO} from 'iso/src/store/bootstrap/repos/issues'
import AppLayout from '../../app/AppLayout'
import React from 'react'
import {RowClassParams} from "ag-grid-community/dist/lib/entities/gridOptions";
import {DateTime} from "luxon";

export default () => {
    const ledger = useLedger()

    const onCreateClick = (defaults) => {
        console.log(defaults)
    }
    console.log("Render IssuesList")
    const getRowStyle = (params:RowClassParams<IssueVO>) => {
        console.log('getRowStyle params ', params)
        const plannedDateTime = DateTime.fromISO(params.data.plannedDate)
        const completedDateTime = DateTime.fromISO(params.data.completedDate)

        const workStartedDateTime = DateTime.fromISO(params.data.workStartedDate)
        const registerDateTime = DateTime.fromISO(params.data.registerDate)
        if (params.data.plannedDate > 0){//params.data..rowIndex % 2 === 0) {
            return { background: 'red' };
        }

        return {background: undefined}
    };
    const [cols,colMap] = useAllColumns(ISSUES)

    const columns = [colMap.clickToEditCol,
        colMap.clientsIssueNumber,
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
                        getRowStyle={getRowStyle}
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