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

export const DashboardManagerSummary: FC<DashboardManagerSummaryProps> = ({ allIssues }) => {
    // todo: вычислять ближайший вторник и отталкиваться от него
    const [period, setPeriod] = useState([dayjs().subtract(7, 'days'), dayjs()]);
    const [periodIssues, setPeriodIssues] = useState([]);
    
    const prevPeriod = () => {
        // если показывается текущая неделя, отнимать до вторников
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

    const isPrevPeriodDisabled = false; // < allIssues.firstRegisteredDate
    const isNextPeriodDisabled = period[1].clone().add(7, 'days').isAfter(dayjs());

    useEffect(() => {
        const result = allIssues.filter(i => !!i.registerDate && dayjs(i.registerDate).isBetween(period[0] || dayjs(new Date(0)), period[1]));

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