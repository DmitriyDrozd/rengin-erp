import { FC, useEffect, useState } from "react";
import { IssueVO } from "iso/src/store/bootstrap/repos/issues";
import Space from "antd/es/space";
import Button from "antd/es/button";
import dayjs, { Dayjs } from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { ManagerSummary } from "./ManagerSummary/ManagerSummary";

interface DashboardManagerSummaryProps {
    allIssues: IssueVO[];
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

const initialEnd = dayjs().add(getDaysDiffToTuesday(dayjs()), 'days');
const initialStart = initialEnd.subtract(6, 'days');

export const DashboardManagerSummary: FC<DashboardManagerSummaryProps> = ({ allIssues }) => {
    const [period, setPeriod] = useState([initialStart, initialEnd]);
    const [periodIssues, setPeriodIssues] = useState([]);
    
    const prevPeriod = () => {
        const newPeriod = [
            period[0].subtract(7, 'days'),
            period[1].subtract(7, 'days'),
        ];

        setPeriod(newPeriod);
    }

    const nextPeriod = () => {
        const newPeriod = [
            period[0].add(7, 'days'),
            period[1].add(7, 'days'),
        ];

        setPeriod(newPeriod);
    }

    const isPrevPeriodDisabled = false;
    const isNextPeriodDisabled = period[1].clone().add(7, 'days').isAfter(initialEnd);

    useEffect(() => {
        const result = allIssues.filter(i => !!i.completedDate && dayjs(i.completedDate).isBetween(period[0] || dayjs(new Date(0)), period[1]));

        setPeriodIssues(result);
    }, [period]);

    return (
        <Space direction="vertical" align="center" style={{ width: '100%' }}>
            {/* *График со всеми неделями и суммам по ним* */}
            <Space direction="horizontal">
                <Button onClick={prevPeriod} disabled={isPrevPeriodDisabled}>предыдущая</Button>
                {period[0].toDate().toLocaleDateString()} - {period[1].toDate().toLocaleDateString()}
                <Button onClick={nextPeriod} disabled={isNextPeriodDisabled}>следующая</Button>
            </Space>
            <ManagerSummary periodIssues={periodIssues}/>
        </Space>
    )
}