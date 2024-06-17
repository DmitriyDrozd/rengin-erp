import { Column } from '@ant-design/plots';
import React from 'react';

const COLORS_MAP = {
    'Всего заявок': '#bae0ff',
    'В работе': '#ffec3d',
    'Приостановлено': '#8c8c8c',
    'Закрыто': '#bae637',
    'Просрочено в закрытых': '#ffa940',
    'Просрочено в активных': '#ff4d4f',
}

export const IssuesPerformance = (
    {
        allIssues,
        inWorkIssues,
        pausedIssues,
        closedIssues,
        outdatedClosedIssues,
        outdatedOpenIssues,
    }
) => {
    const data = [
        {
            type: 'Всего заявок',
            value: allIssues.length,
        },
        {
            type: 'В работе',
            value: inWorkIssues.length,
        },
        {
            type: 'Приостановлено',
            value: pausedIssues.length,
        },
        {
            type: 'Закрыто',
            value: closedIssues.length,
        },
        {
            type: 'Просрочено в закрытых',
            value: outdatedClosedIssues.length,
        },
        {
            type: 'Просрочено в активных',
            value: outdatedOpenIssues.length,
        },
    ];

    const config = {
        data,
        xField: 'type',
        yField: 'value',
        columnStyle: ({ type }) => ({ fill: COLORS_MAP[type] }),
        label: {
            position: 'middle',
            layout: [
                {
                    type: 'interval-adjust-position',
                },
                {
                    type: 'interval-hide-overlap',
                },
                {
                    type: 'adjust-color',
                },
            ],
        },
    };

    return <Column {...config} />;
};