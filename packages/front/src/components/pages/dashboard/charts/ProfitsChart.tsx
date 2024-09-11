import { Area, Column } from '@ant-design/plots';
import React, { FC } from 'react';
import { getAnnotation, formatMoneyRub } from './helpers';
import { estimationStatusesList, ExpenseVO } from 'iso/src/store/bootstrap/repos/expenses';
import { Days } from 'iso/src/utils';
import Card from 'antd/es/card/Card';
import { Typography } from 'antd';
import { groupBy, prop } from 'ramda';

const estimationStatuses = [
    estimationStatusesList[0],
    estimationStatusesList[1],
    estimationStatusesList[2],
    estimationStatusesList[3],
    estimationStatusesList[4],
];

const amountReducer = (acc: number, { expensePriceFinal }: ExpenseVO) => {
    if (!!expensePriceFinal) {
        if (isNaN(+expensePriceFinal) || isNaN(acc + +expensePriceFinal)) {
            return acc;
        }

        return acc + +expensePriceFinal;
    }

    return acc;
};

interface ProfitsChartProps {
    allEstimations: ExpenseVO[];
}

export const ProfitsChart: FC<ProfitsChartProps> = (
    {
        allEstimations,
    }
) => {
    let data: Array<{ dateFR: string, value: number, status: string }> = [];
    const annotations = [];

    const FRs: {
        [dateFR: string]: ExpenseVO[];
    } = allEstimations.reduce((acc, estimation: ExpenseVO) => {
        const dateFR = Days.asMonthYear(estimation.dateFR);
        
        return {
            ...acc,
            [dateFR]: [...(acc[dateFR] || []), estimation],
        };
    }, {});

    for (const FR in FRs) {
        let totalFRProfit = 0;

        const dataByStatuses = estimationStatuses.map((status) => {
            const estimationsInStatus = FRs[FR].filter((estimation: ExpenseVO) => {
                return estimation.estimationsStatus === status;
            });

            const FRProfit = estimationsInStatus.reduce(amountReducer, 0);
            totalFRProfit += FRProfit;

            return {
                dateFR: FR,
                value: Math.round(FRProfit),
                status,
                count: estimationsInStatus.length,
            };
        });

        annotations.push(getAnnotation(FR, 0, formatMoneyRub(totalFRProfit)));

        data = [...dataByStatuses, ...data];
    }

    const config = {
        annotations,
        data,
        xField: 'dateFR',
        yField: 'value',
        isStack: true,
        seriesField: 'status',
        label: {
            formatter: (datanum) => {
                if (datanum.value === 0) {
                    return null;
                }
                
                return formatMoneyRub(datanum.value);
            },
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
        tooltip: {
            formatter: (datum) => {
                const statusCount = FRs[datum.dateFR].filter(e => e.estimationsStatus === datum.status).length;
                const statusSum = formatMoneyRub(datum.value);

                return {
                    name: datum.status,
                    value: `${statusCount} смет на сумму ${statusSum}`,
                }
            }
          },
    };

    const totalProfit = allEstimations.reduce(amountReducer, 0);
    const countProcessingUndone = allEstimations.filter(e => e.estimationsStatus === estimationStatusesList[1] && !e.expensePriceFinal).length;
    const countProcessingDone = allEstimations.filter(e => e.estimationsStatus === estimationStatusesList[1] && !!e.expensePriceFinal).length;
    const countProcessedUndone = allEstimations.filter(e => e.estimationsStatus === estimationStatusesList[2] && !e.expensePriceFinal).length;
    const byStatus = groupBy<ExpenseVO>(prop('estimationsStatus'), allEstimations);

    const ChartElement = Object.keys(FRs).length <= 1 ? Column : Area;

    return (
        <div style={{ width: '100%' }}>
            <ChartElement {...config} />
            <Card bodyStyle={{ display: 'flex', justifyContent: 'space-between', gap: 36 }}>
                <div>
                    <div>
                        <Typography.Title level={5}>Количество смет:</Typography.Title>
                        {allEstimations.length}
                    </div>
                    <div>
                        <Typography.Title level={5}>Общий доход:</Typography.Title>
                        {formatMoneyRub(totalProfit)}
                    </div>
                </div>
                <div>
                    {Object.keys(byStatus).map(status => (
                        <div key={status}>
                            <Typography.Title level={5}>{status}:</Typography.Title>
                            {byStatus[status].length}
                        </div>
                    ))}
                </div>
                <div>
                    <div>
                        <Typography.Title level={5}>На согласовании, не выполнено:</Typography.Title>
                        {countProcessingUndone}
                    </div>
                    <div>
                        <Typography.Title level={5}>На согласовании, выполнено:</Typography.Title>
                        {countProcessingDone}
                    </div>
                    <div>
                        <Typography.Title level={5}>Согласовано, не выполнено:</Typography.Title>
                        {countProcessedUndone}
                    </div>
                </div>
            </Card>
        </div>
    );
};