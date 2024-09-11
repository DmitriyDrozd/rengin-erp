import { Area, Column } from '@ant-design/plots';
import React, { FC } from 'react';
import { getAnnotation, formatMoneyRub } from './helpers';
import { estimationStatusesList, ExpenseVO } from 'iso/src/store/bootstrap/repos/expenses';
import { Days } from 'iso/src/utils';
import Card from 'antd/es/card/Card';
import { Typography } from 'antd';
import { groupBy, prop } from 'ramda';

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

        const dataByStatuses = estimationStatusesList.map((status) => {
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
            </Card>
        </div>
    );
};