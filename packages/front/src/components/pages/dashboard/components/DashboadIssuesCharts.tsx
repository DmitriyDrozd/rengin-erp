import {
    Card,
    Select
} from 'antd';
import React, {
    useState
} from 'react';
import { IssuesByBrand } from '../charts/IssuesByBrand';
import { IssuesByManager } from '../charts/IssuesByManager';

const issuesOptions = [
    {
        label: 'менеджерам',
        value: 'менеджерам',
    },
    {
        label: 'заказчикам',
        value: 'заказчикам',
    }
]

export const DashboadIssuesCharts = (
    {
        Filters,
        closedIssues,
        registeredIssues,
        outdatedClosedIssues,
        outdatedOpenIssues,
    }
) => {
    const [option, setOption] = useState('менеджерам');
    const Chart = option === 'менеджерам' ? IssuesByManager : IssuesByBrand;

    return (
        <div style={{ display: 'flex', gap: 24, width: '100%' }}>
            <Filters>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ textWrap: 'nowrap' }}>Заявки по:</span>
                    <Select
                        defaultValue={option}
                        onSelect={setOption}
                        style={{width: '100%'}}
                        options={issuesOptions}
                    />
                </div>
            </Filters>
            <div style={{ textAlign: 'center', flexGrow: 1 }}>
                <b>Заявки по {option}</b>
                    <Chart
                        closedIssues={closedIssues}
                        registeredIssues={registeredIssues}
                        outdatedClosedIssues={outdatedClosedIssues}
                        outdatedOpenIssues={outdatedOpenIssues}
                    />
            </div>
        </div>
    );
};