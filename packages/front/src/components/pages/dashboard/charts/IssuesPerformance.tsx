import { Column } from '@ant-design/plots';
import React, { FC } from 'react';
import useLedger from '../../../../hooks/useLedger';
import { getAnnotation } from './helpers';
import { IssueVO } from 'iso/src/store/bootstrap/repos/issues';

interface IssuesPerformanceProps {
    invert?: boolean,
    allIssues: IssueVO[],
    inWorkIssues: IssueVO[],
    pausedIssues: IssueVO[],
    closedIssues: IssueVO[],
    outdatedClosedIssues: IssueVO[],
    outdatedOpenIssues: IssueVO[],
}

export const IssuesPerformance: FC<IssuesPerformanceProps> = (
    {
        invert,
        allIssues,
        inWorkIssues,
        pausedIssues,
        closedIssues,
        outdatedClosedIssues,
        outdatedOpenIssues,
    }
) => {
    const ledger = useLedger();
    let data: Array<{ type: string, value: number, customer: string }> = [];

    const allCustomers = allIssues
        .reduce((acc, curr) => {
            if (!acc.includes(curr.brandId)) {
                return [...acc, curr.brandId];
            }

            return acc;
        }, [])
        .map(customerId => ledger.brands.byId[customerId]);

    allCustomers.forEach(customer => {
        const customerFilter = (i: { brandId: string; }) => i.brandId === customer.brandId;

        data = [
            ...data,
            {
                type: 'Всего заявок',
                value: allIssues.filter(customerFilter).length,
                customer: customer.brandName,
            },
            {
                type: 'В работе',
                value: inWorkIssues.filter(customerFilter).length,
                customer: customer.brandName,
            },
            {
                type: 'Приостановлено',
                value: pausedIssues.filter(customerFilter).length,
                customer: customer.brandName,
            },
            {
                type: 'Закрыто',
                value: closedIssues.filter(customerFilter).length,
                customer: customer.brandName,
            },
            {
                type: 'Просрочено в закрытых',
                value: outdatedClosedIssues.filter(customerFilter).length,
                customer: customer.brandName,
            },
            {
                type: 'Просрочено в активных',
                value: outdatedOpenIssues.filter(customerFilter).length,
                customer: customer.brandName,
            },
        ];
    });

    const annotations = [
        getAnnotation('Всего заявок', allIssues.length),
        getAnnotation('В работе', inWorkIssues.length),
        getAnnotation('Приостановлено', pausedIssues.length),
        getAnnotation('Закрыто', closedIssues.length),
        getAnnotation('Просрочено в закрытых', outdatedClosedIssues.length),
        getAnnotation('Просрочено в активных', outdatedOpenIssues.length),
    ];

    const config = {
        annotations,
        data,
        xField: 'type',
        yField: 'value',
        isStack: true,
        seriesField: 'customer',
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