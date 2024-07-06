import React, { FC } from 'react';
import { getAnnotation, formatMoneyRub } from './helpers';
import { Days } from 'iso/src/utils';
import { IssueVO } from 'iso/src/store/bootstrap/repos/issues';
import useLedger from '../../../../hooks/useLedger';
import { Line } from '@ant-design/plots';

interface ProfitsChartProps {
    typeFilter: (subject: string, ledger?: any) => (issue: IssueVO) => boolean,
    subjectOptions?: { label: string, value: string }[],
    allIssues: IssueVO[];
}

export const IssuesByDateChart: FC<ProfitsChartProps> = (
    {
        typeFilter,
        subjectOptions,
        allIssues,
    }
) => {
    const ledger = useLedger();

    if (!subjectOptions) {
        return null;
    }

    const isLargeSubjectCount = subjectOptions.length > 20;

    let data: Array<{ day: string, value: number, subject: string }> = [];
    const annotations = [];

    const dates = allIssues.reduce((acc: {
        [registerDate: string]: IssueVO[];
    }, issue: IssueVO) => {
        const dateR = Days.asDay(issue.registerDate).format('DD/MM/YYYY');

        return {
            ...acc,
            [dateR]: [...(acc[dateR] || []), issue],
        };
    }, {});

    for (const date in dates) {
        const values = dates[date];
        
        subjectOptions.forEach(({ label: name, value: id }: { label: string, value: string }) => {
            const subjectFilter = typeFilter(id, ledger);
            const subjectIssues = values.filter(subjectFilter);

            if (isLargeSubjectCount && !subjectIssues.length) {
                return;
            }

            data.push({
                day: date,
                value: subjectIssues.length,
                subject: name,
            });
        });

        annotations.push(getAnnotation(date, values.length));
    }

    const config = {
        annotations,
        data,
        xField: 'day',
        yField: 'value',
        seriesField: 'subject',
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
        animation: {
            appear: {
              animation: 'path-in',
              duration: 2000,
            },
        },
    };

    return (
        <div style={{ width: '100%' }}>
            <Line {...config} />
        </div>
    );
};