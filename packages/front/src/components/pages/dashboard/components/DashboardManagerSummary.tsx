import { FC, useEffect, useState } from "react";
import { IssueVO } from "iso/src/store/bootstrap/repos/issues";
import Space from "antd/es/space";
import Button from "antd/es/button";
import dayjs, { Dayjs } from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { ManagerSummary } from "./ManagerSummary/ManagerSummary";
import { Period } from "iso/src/utils/date-utils";

interface DashboardManagerSummaryProps {
    periodIssues: IssueVO[];
    Filters: ({ children }: { children: React.ReactNode }) => JSX.Element;
    updatePeriod: (period: Period) => void;
    isWeekSelection: boolean;
}

dayjs.extend(isBetween);

const getDaysDiffToTuesday = (date: Dayjs) => {
    const dateClone = date.clone();

    let res = 0;

    while (!dateClone.add(res, 'day').toDate().toDateString().includes('Mon')) {
        res++;
    }

    return res;
}

const initialEnd: Dayjs = dayjs().add(getDaysDiffToTuesday(dayjs()), 'days');
const initialStart: Dayjs = initialEnd.subtract(6, 'days');
const initialPeriod: Period = [initialStart, initialEnd];

export const DashboardManagerSummary: FC<DashboardManagerSummaryProps> = ({ periodIssues, Filters, updatePeriod, isWeekSelection }) => {
    const [period, setPeriod] = useState<Period>(initialPeriod);
    
    const prevPeriod = () => {
        const newPeriod: Period = [
            period[0].subtract(7, 'days'),
            period[1].subtract(7, 'days'),
        ];

        setPeriod(newPeriod);
        updatePeriod(newPeriod);
    }

    const nextPeriod = () => {
        const newPeriod: Period = [
            period[0].add(7, 'days'),
            period[1].add(7, 'days'),
        ];

        setPeriod(newPeriod);
        updatePeriod(newPeriod);
    }

    const isPrevPeriodDisabled = !isWeekSelection ||  false;
    const isNextPeriodDisabled = !isWeekSelection || period[1].clone().add(7, 'days').isAfter(initialEnd);

    useEffect(() => {
        if (isWeekSelection) {
            setPeriod(initialPeriod);
            updatePeriod(initialPeriod);
        }
    }, [isWeekSelection]);

    return (
        <div style={{ display: 'flex', gap: 24, width: '100%' }}>
            <Filters>
                { isWeekSelection ? (
                    <Space direction="vertical" align="center" style={{ width: '100%', alignItems: 'stretch' }}>
                        {/* *График со всеми неделями и суммам по ним* */}
                        <Space direction="horizontal" style={{ width: '100%', justifyContent: 'space-between' }}>
                            <Button onClick={prevPeriod} disabled={isPrevPeriodDisabled}>предыдущая</Button>
                            {period[0].toDate().toLocaleDateString()} - {period[1].toDate().toLocaleDateString()}
                            <Button onClick={nextPeriod} disabled={isNextPeriodDisabled}>следующая</Button>
                        </Space>
                    </Space>
                ) : null }
            </Filters>
            <ManagerSummary periodIssues={periodIssues}/>
        </div>
    )
}