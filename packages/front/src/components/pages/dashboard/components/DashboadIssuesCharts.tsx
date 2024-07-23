import {
    Card,
    Select
} from 'antd';
import React, {
    useState
} from 'react';
import { IssuesByBrand } from '../charts/IssuesByBrand';
import { IssuesByManager } from '../charts/IssuesByManager';
import { IssuesByDepartment } from '../charts/IssuesByDepartment';

const issuesOptions = [
    {
        label: 'менеджерам',
        value: 'менеджерам',
    },
    {
        label: 'заказчикам',
        value: 'заказчикам',
    },
    {
        label: 'отделам',
        value: 'отделам',
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

    let Chart;

    switch (option) {
        case 'менеджерам': {
            Chart = IssuesByManager;
            break;
        };
        case 'заказчикам': {
            Chart = IssuesByBrand;
            break;
        };
        case 'отделам': {
            Chart = IssuesByDepartment;
            break;
        };
    }

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