import React, { FC } from 'react';
import { getAnnotation, getAnnotationDataCount } from './helpers';
import { Days } from 'iso/src/utils';
import { IssueVO } from 'iso/src/store/bootstrap/repos/issues';
import useLedger from '../../../../hooks/useLedger';
import { Column, Line } from '@ant-design/plots';
import { PERIOD_TYPE, PERIOD_TYPES } from '../components/helpers';
import { asDay } from 'iso/src/utils/date-utils';

interface ProfitsChartProps {
    periodType: PERIOD_TYPE,
    typeFilter: (subject: string, ledger?: any) => (issue: IssueVO) => boolean,
    subjectOptions?: { label: string, value: string }[],
    subjectFilter?: (issue: IssueVO) => boolean,
    subject?: { label: string, value: string },
    allIssues: IssueVO[];
    performance?: {
        pausedIssues: IssueVO[],
        closedIssues: IssueVO[],
        inWorkIssues: IssueVO[],
        outdatedClosedIssues: IssueVO[],
        outdatedOpenIssues: IssueVO[],
    }
}

export const IssuesByDateChart: FC<ProfitsChartProps> = (
    {
        periodType,
        typeFilter,
        subjectOptions,
        subjectFilter,
        subject,
        allIssues,
        performance,
    }
) => {
    const ledger = useLedger();

    if (!subjectOptions) {
        return null;
    }

    const isLargeSubjectCount = subjectOptions.length > 20;
    const annotations = [];

    let data: Array<{ day: string, value: number, subject?: string, type?: string }> = [];
    let dateFormat;

    switch (periodType) {
        case PERIOD_TYPES.hour:
            dateFormat = 'HH:MM';
            break;
        case PERIOD_TYPES.day:
            dateFormat = 'DD/MM/YYYY';
            break;
        case PERIOD_TYPES.month:
            dateFormat = 'MM/YYYY';
            break;
        default:
            dateFormat = 'DD/MM/YYYY';
            break;
    }

    const dateReducer = (acc: {
        [registerDate: string]: IssueVO[];
    }, issue: IssueVO) => {
        const regDate = Days.asDay(issue.registerDate);

        if (!regDate) {
            return acc;
        }

        const dateR = regDate.format(dateFormat);

        return {
            ...acc,
            [dateR]: [...(acc[dateR] || []), issue],
        };
    };

    const issuesByDate = allIssues.reduce(dateReducer, {});
    const isSubjectFiltered = subject && performance;

    if (isSubjectFiltered) {
        const {
            pausedIssues,
            closedIssues,
            inWorkIssues,
            outdatedClosedIssues,
            outdatedOpenIssues,
        } = performance;

        const fAll = allIssues.reduce(dateReducer, {});
        const fInWork = inWorkIssues.reduce(dateReducer, {});
        const fPaused = pausedIssues.reduce(dateReducer, {});
        const fClosed = closedIssues.reduce(dateReducer, {});
        const fOutdatedC = outdatedClosedIssues.reduce(dateReducer, {});
        const fOutdatedO = outdatedOpenIssues.reduce(dateReducer, {});

        for (const date in issuesByDate) {
            const newData = [
                {
                    type: 'Всего заявок',
                    value: fAll[date].filter(subjectFilter).length,
                    day: date,
                },
                fInWork[date] && {
                    type: 'В работе',
                    value: fInWork[date].filter(subjectFilter).length,
                    day: date,
                },
                fPaused[date] && {
                    type: 'Приостановлено',
                    value: fPaused[date].filter(subjectFilter).length,
                    day: date,
                },
                fClosed[date] && {
                    type: 'Закрыто',
                    value: fClosed[date].filter(subjectFilter).length,
                    day: date,
                },
                fOutdatedC[date] && {
                    type: 'Просрочено в закрытых',
                    value: fOutdatedC[date].filter(subjectFilter).length,
                    day: date,
                },
                fOutdatedO[date] && {
                    type: 'Просрочено в активных',
                    value: fOutdatedO[date].filter(subjectFilter).length,
                    day: date,
                },
            ].filter(d => d !== undefined);

            data = [
                ...data,
                ...newData,
            ];
        }

        const dataCount = getAnnotationDataCount(data);
        annotations.push(getAnnotation('Всего заявок', allIssues.length, { dataCount }));
        annotations.push(getAnnotation('В работе', inWorkIssues.length, { dataCount }));
        annotations.push(getAnnotation('Приостановлено', pausedIssues.length, { dataCount }));
        annotations.push(getAnnotation('Закрыто', closedIssues.length, { dataCount }));
        annotations.push(getAnnotation('Просрочено в закрытых', outdatedClosedIssues.length, { dataCount }));
        annotations.push(getAnnotation('Просрочено в активных', outdatedOpenIssues.length, { dataCount }));
    } else {
        const annotationsDataCountValues: {[date: string]: number} = {};

        for (const date in issuesByDate) {
            const values = issuesByDate[date];
            
            subjectOptions.forEach(({ label: name, value: id }: { label: string, value: string }) => {
                const _subjectFilter = typeFilter(id, ledger);
                const subjectIssues = values.filter(_subjectFilter);
    
                if (isLargeSubjectCount && !subjectIssues.length) {
                    return;
                }
    
                data.push({
                    day: date,
                    value: subjectIssues.length,
                    subject: name,
                });
            });
    
            annotationsDataCountValues[date] = values.length;
        }

        const dataCount = getAnnotationDataCount(data);
        for (const date in issuesByDate) {
            annotations.push(getAnnotation(date, annotationsDataCountValues[date], { dataCount }));
        }
    }

    const sortedData = data.sort((a, b) => a.day === b.day ? 0 : asDay(a.day, dateFormat).isSameOrAfter(asDay(b.day, dateFormat)) ? 1 : -1);

    const config = {
        annotations,
        data: sortedData,
        xField: 'day',
        xAxis: {
            label: {
                rotate: Math.PI / -6,
                offset: 20,
                style: {
                    fill: '#aaa',
                    fontSize: 12,
                },
            },
            grid: {
                line: {
                    style: {
                        stroke: '#ddd',
                        lineDash: [4, 2],
                    },
                },
                alternateColor: 'rgba(0,0,0,0.05)',
            },
        },
        yField: 'value',
        seriesField: isSubjectFiltered ? 'type' : 'subject',
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

    const Chart = subject ? Column : Line;

    return (
        <div style={{ width: '100%' }}>
            <Chart {...config} />
        </div>
    );
};