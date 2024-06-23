import { Column } from '@ant-design/plots';
import {
    IssueVO
} from 'iso/src/store/bootstrap/repos/issues';
import {
    USERS,
    UserVO
} from 'iso/src/store/bootstrap/repos/users';
import React from 'react';
import { useSelector } from 'react-redux';

export const IssuesByManager = (
    {
        registeredIssues,
        closedIssues,
        outdatedClosedIssues,
        outdatedOpenIssues,
    }
) => {
    const annotations = [];

    const users: UserVO[] = useSelector(USERS.selectAll);
    const data = users.filter(user => user.role === 'менеджер').map(user => {
        const userName = user ? `${user.lastname} ${user.name}` : 'Без менеджера';
        const filterByUser = (i: IssueVO) => i.managerUserId === user.userId;

        const registeredByUser = registeredIssues.filter(filterByUser).length;
        const closedByUser = closedIssues.filter(filterByUser).length;
        const outdatedClosedByUser = outdatedClosedIssues.filter(filterByUser).length;
        const outdatedOpenByUser = outdatedOpenIssues.filter(filterByUser).length;

        if (!registeredByUser && !closedByUser && !outdatedClosedByUser && !outdatedOpenByUser) {
            return [];
        }

        const getData = (count, type) => ({
            'manager': userName,
            'value': count,
            'type': type,
        });

        return [
            getData(registeredByUser, 'Созданные'),
            getData(closedByUser, 'Закрытые'),
            getData(outdatedClosedByUser, 'Просрочено в закрытых'),
            getData(outdatedOpenByUser, 'Просрочено в работе'),
        ];
    })
        .flat();

    const dataObj = data
        .reduce((acc, item) => {
            if (!acc[item.manager]) {
                acc[item.manager] = [item];
            } else {
                acc[item.manager].push(item);
            }

            return acc;
        }, {});

    users.map(user => {
        const userName = user ? `${user.lastname} ${user.name}` : 'Без менеджера';
        const userData = dataObj[userName];

        if (userData) {
            const value = userData.reduce((a, d) => a += d.value, 0);
            annotations.push({
                type: 'text',
                position: [userName, value],
                content: `${value}`,
                style: {
                    textAlign: 'center',
                    fontSize: 14,
                    fill: 'rgba(0,0,0,0.85)',
                },
                offsetY: -10,
            });
        }
    });

    const config = {
        data,
        isStack: true,
        xField: 'manager',
        yField: 'value',
        seriesField: 'type',
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
        annotations,
    };

    return <Column {...config} />;
};
