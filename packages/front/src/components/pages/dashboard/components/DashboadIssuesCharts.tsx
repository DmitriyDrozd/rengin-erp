import { Card } from 'antd';
import React, { CSSProperties } from 'react';
import { IssuesByBrand } from '../IssuesByBrand';
import { IssuesByManager } from '../IssuesByManager';

const gridStyle: CSSProperties = {
    width: '50%',
    textAlign: 'center',
};

export const DashboadIssuesCharts = ({
                                         closedIssues,
                                         openedIssues,
                                         outdatedClosedIssues,
                                         outdatedOpenIssues,
                                     }) => {
    return (
        <>
            <Card.Grid hoverable={false} style={gridStyle}>
                <b>Заявки по менеджерам</b>
                <IssuesByManager
                    closedIssues={closedIssues}
                    openedIssues={openedIssues}
                    outdatedClosedIssues={outdatedClosedIssues}
                    outdatedOpenIssues={outdatedOpenIssues}
                />
            </Card.Grid>

            <Card.Grid hoverable={false} style={gridStyle}>
                <b>Заявки по заказчикам</b>
                <IssuesByBrand
                    closedIssues={closedIssues}
                    openedIssues={openedIssues}
                    outdatedClosedIssues={outdatedClosedIssues}
                    outdatedOpenIssues={outdatedOpenIssues}
                />
            </Card.Grid>
        </>
    );
};