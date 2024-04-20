import * as Icons from '@ant-design/icons';
import {AppstoreOutlined, BarChartOutlined, CalendarOutlined, MailOutlined} from '@ant-design/icons';
import React from 'react'
import {
    roleEnum,
    RoleType
} from 'iso/src/store/bootstrap/repos/users';

type TRoute = {
    path: string,
    name: string,
    icon?: JSX.Element,
    admin?: boolean,
    estimator?: boolean,
    routes?: TRoute[],
};

const filterAdminRole = ({ isAdmin, isEstimator }: { isAdmin: boolean, isEstimator: boolean }) => (item: TRoute) => {
    return item.admin ? isAdmin : item.estimator ? isEstimator : true
};

const mapFiltered = (item: TRoute) => {
    const { admin, estimator, ...rest } = item;

    return rest;
};

export default (role: RoleType) => {
    const isAdmin = role === roleEnum['руководитель'];
    const isEstimator = role === roleEnum['сметчик']
    const adminFilter = filterAdminRole({ isAdmin, isEstimator });

    const routesDictionaries: TRoute[] = [
        {
            path: "/app/in/brands",
            name: "Заказчики",
        },
        {
            path: "/app/in/legals",
            name: "Юр Лица",
        },
        {
            path: "/app/in/sites",
            name: "Объекты",
        },
        {
            path: "/app/in/employees",
            name: "Сотрудники",
        },
        {
            path: "/app/in/import-sites",
            name: "Импорт",
        }
    ].filter(adminFilter).map(mapFiltered);

    const routes: TRoute[] = [
        {
            path: "/app/in/dashboard",
            name: "Дашборд",
            icon: <BarChartOutlined />,
            admin: true,
        },
        {
            path: "/app/in/issues",
            name: "Заявки",
            icon: <MailOutlined />,
        },
        {
            path: "/app/in/contracts",
            name: "Договоры",
            icon: <CalendarOutlined />,
            estimator: true,
        },
        {
            admin: true,
            path: "/app/in/dicts",
            name: "Справочники",
            icon: <AppstoreOutlined />,
            routes: routesDictionaries,
        },
        {
            path: "/app/in/users",
            name: "Пользователи",
            icon: <Icons.UserOutlined/>,
            admin: true,
        },
        {
            path: "/app/in/backup",
            name: "Резервная копия  ",
            icon: <Icons.HistoryOutlined/>,
            admin: true,
        }
    ].filter(adminFilter).map(mapFiltered);

    return {
        route: {
            routes,
        },
        appList: [],
    }
}