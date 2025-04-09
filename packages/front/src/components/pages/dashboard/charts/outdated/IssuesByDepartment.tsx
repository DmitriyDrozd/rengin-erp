import React from 'react';
import { Column } from '@ant-design/plots';
import {
    IssueVO
} from 'iso/src/store/bootstrap/repos/issues';
import {
    USERS,
    UserVO
} from 'iso/src/store/bootstrap/repos/users';
import { useSelector } from 'react-redux';

export const IssuesByDepartment = (
    {
        registeredIssues,
        closedIssues,
        outdatedClosedIssues,
        outdatedOpenIssues,
    }
) => {
    const annotations = [];

    const users: UserVO[] = useSelector(USERS.selectAll);

    const usersByDepartment = users.reduce((acc, curr) => {
        const dep = curr.department || 'Не указан';

        if (!acc[dep]) {
            acc[dep] = [];
        }

        acc[dep].push(curr.userId);

        return acc;
    }, {});

    let data = [];
    
    for (const department in usersByDepartment) {
        const filterByDepartment = (i: IssueVO) => {
            return [i.managerUserId, i.estimatorUserId].some(uid => usersByDepartment[department].includes(uid));
        }

        const registeredByDep = registeredIssues.filter(filterByDepartment).length;
        const closedByDep = closedIssues.filter(filterByDepartment).length;
        const outdatedClosedByDep = outdatedClosedIssues.filter(filterByDepartment).length;
        const outdatedOpenByDep = outdatedOpenIssues.filter(filterByDepartment).length;

        if (registeredByDep || closedByDep || outdatedClosedByDep || outdatedOpenByDep) {
            const getData = (count, type) => ({
                'department': department,
                'value': count,
                'type': type,
            });
    
            data.push([
                getData(registeredByDep, 'Созданные'),
                getData(closedByDep, 'Закрытые'),
                getData(outdatedClosedByDep, 'Просрочено в закрытых'),
                getData(outdatedOpenByDep, 'Просрочено в работе'),
            ]);
        }
    }

    data = data.flat();

    const dataObj = data
        .reduce((acc, item) => {
            if (!acc[item.department]) {
                acc[item.department] = [item];
            } else {
                acc[item.department].push(item);
            }

            return acc;
        }, {});

    for (const department in usersByDepartment) {
        const depData = dataObj[department];

        if (depData) {
            const value = depData.reduce((a, d) => a += d.value, 0);
            annotations.push({
                type: 'text',
                position: [department, value],
                content: `${value}`,
                style: {
                    textAlign: 'center',
                    fontSize: 14,
                    fill: 'rgba(0,0,0,0.85)',
                },
                offsetY: -10,
            });
        }
    }

    const config = {
        data,
        isStack: true,
        xField: 'department',
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
