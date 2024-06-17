import { useCallback } from 'react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Rectangle,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts';
import { IssueVO } from 'iso/src/store/bootstrap/repos/issues';
import { useSelector } from 'react-redux';
import { USERS } from 'iso/src/store/bootstrap';
import { UserVO } from 'iso/src/store/bootstrap/repos/users';

export type Datum = {
    name: string
    value: number
}

export type  IssueChartData = {
    issues: IssueVO[]
    color: string
}

export default ({issues, color}: IssueChartData) => {
    const users: UserVO[] = useSelector(USERS.selectAll);

    const getProcessedByUser = useCallback((user?: UserVO) => ({
        name: user ? `${user.lastname} ${user.name}` : 'Без менеджера',
        value: issues.filter(issue => issue.managerUserId === (user ? user.userId : undefined)).length,
    }), [issues]);

    const processedTotal = { name: 'Всего', value: issues.length };
    const processedByUser = users.map(getProcessedByUser);
    const processedByNotDefined = getProcessedByUser();

    const data: Datum[] = [
        processedTotal,
        ...processedByUser,
        processedByNotDefined,
    ].filter((d, i) => i === 0 || d.value > 0);

    return <ResponsiveContainer width="100%" height="100%">
        <BarChart
            width={500}
            height={300}
            data={data}
            margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
            }}
        >
            <CartesianGrid strokeDasharray="3 3"/>
            <XAxis dataKey="name"/>
            <YAxis/>
            <Tooltip label={'Количество'} />
            <Bar dataKey="value" fill={color || 'pink'} activeBar={<Rectangle fill={color || 'pink'} stroke={color}/>}/>
        </BarChart>
    </ResponsiveContainer>;
}