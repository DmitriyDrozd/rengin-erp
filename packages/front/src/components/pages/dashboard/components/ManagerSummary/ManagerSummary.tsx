import Space from "antd/es/space"
import { IssueVO } from "iso/src/store/bootstrap/repos/issues"
import { FC } from "react"
import useLedger from "../../../../../hooks/useLedger";
import { ROLES } from "iso/src/store/bootstrap/repos/users";
import Statistic from "antd/es/statistic";
import Card from "antd/es/card";
import Avatar from "antd/es/avatar";
import UserOutlined from "@ant-design/icons/lib/icons/UserOutlined";
import Flex from "antd/es/flex";

interface ManagerSummaryProps {
    periodIssues: IssueVO[];
}

export const ManagerSummary: FC<ManagerSummaryProps> = ({ periodIssues }) => {
    const ledger = useLedger();
    const users = ledger.users.byId;
    const issuesByUser: { [managerId: string]: IssueVO[] } = {};
    
    periodIssues.forEach(issue => {
        if (!issuesByUser[issue.managerUserId]) {
            issuesByUser[issue.managerUserId] = [];
        }

        issuesByUser[issue.managerUserId].push(issue);
    });

    const statsByUser = [];
    let profitSum = 0;

    for (const userId in issuesByUser) {
        const user = users[userId];

        if (!user) {
            continue;
        }

        const userName = user.name + ' ' + user.lastname;
        const userAbbreviation = user.name[0] + user.lastname[0];

        const userIssues = issuesByUser[userId];
        const profit = userIssues.reduce((acc, item) => {
            const sum = item.estimationPrice ? +item.estimationPrice : item.estimations?.reduce((_acc, _item) => _acc += isNaN(_item.amount) ? 0 : +_item.amount, 0) || 0;
            return acc += sum;
        }, 0);

        profitSum += profit;

        statsByUser.push({
            userAbbreviation,
            userName,
            profit,
            count: userIssues.length,
        })
    }

    const sortedByCount = statsByUser.sort((a, b) => b.count - a.count);
    const sortedStats = sortedByCount.sort((a, b) => b.profit - a.profit);

    return (
        <Space direction="vertical" align="center">
            <Flex wrap="wrap" gap="small">
                {
                    sortedStats.map(({ userAbbreviation, userName, profit, count }) => (
                        <Card key={userName}>
                            <Space direction="vertical" align="center">
                                <Avatar style={{ backgroundColor: '#87d068' }} size="large" icon={<UserOutlined />}>{userAbbreviation}</Avatar>
                                {userName}
                            </Space>
                            <Statistic value={count} title="Количество заявок" />
                            <Statistic value={profit} title="Прибыль" />
                        </Card>
                    ))
                }
            </Flex>
            <Flex wrap="wrap" gap="large">
                <Statistic value={periodIssues.length} title="заявок за период" />
                <Statistic value={profitSum} title="сумма" />
            </Flex>
        </Space>
    )
}