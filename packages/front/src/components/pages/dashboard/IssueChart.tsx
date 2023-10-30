import {Bar, BarChart, CartesianGrid, Legend, Rectangle, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import {IssueVO} from "iso/src/store/bootstrap/repos/issues";
import {useSelector} from "react-redux";
import {USERS} from "iso/src/store/bootstrap";
import {UserVO} from "iso/src/store/bootstrap/repos/users";

const data = [
    {
        name: 'Всего',
        value: 120,
    },
    {
        name: 'Мышланов Р.С.',
        value: 32
    },
    {
        name: 'Фёдоров',
        value: 40
    },
    {
        name: 'Не указан',
        value: 48
    }
];

export type Datum = {
    name: string
    value: number
}

export type  IssueChartData = {
    issues: IssueVO[]
    color: string
}

export default ({issues, color}: IssueChartData) => {
    const users: UserVO[] = useSelector(USERS.selectAll)
    const data: Datum[] = [
        {
            name: 'Всего',
            value: issues.length
        },
        ...users.map ( u => ({
            name: u.fullName,
            value: issues.filter(i => i.responsibleManagerId === u.userId).length
        })).filter( d => d.value > 0),
        {
            name: 'Не задан',
            value: issues.filter(i => i.responsibleManagerId === undefined).length
        }
    ]
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
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            {
                //<Legend />
                 }
            <Bar dataKey="value" fill="#8884d8" activeBar={<Rectangle fill={color || "pink"} stroke={color} />} />
        </BarChart>
    </ResponsiveContainer>
}