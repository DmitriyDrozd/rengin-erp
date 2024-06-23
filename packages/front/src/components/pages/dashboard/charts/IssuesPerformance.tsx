import { Column } from '@ant-design/plots';
import React from 'react';
import useLedger from '../../../../hooks/useLedger';

const getAnnotation = (type, value) => ({
    type: 'text',
    position: [type, value],
    content: `${value}`,
    style: {
        textAlign: 'center',
        fontSize: 14,
        fill: 'rgba(0,0,0,0.85)',
    },
    offsetY: -10,
})

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
        const customerFilter = i => i.brandId === customer.brandId;

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