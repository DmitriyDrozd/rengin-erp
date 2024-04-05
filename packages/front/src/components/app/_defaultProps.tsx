import * as Icons from '@ant-design/icons';
import {AppstoreOutlined, BarChartOutlined, CalendarOutlined, MailOutlined} from '@ant-design/icons';
import React from 'react'
import {RoleType} from "iso/src/store/bootstrap/repos/users"

type TRoute = {
    path: string,
    name: string,
    icon?: JSX.Element,
    admin?: boolean,
    routes?: TRoute[],
};

const filterAdminRole = (isAdmin: boolean) => (item: TRoute) => item.admin ? isAdmin : true;
const mapFiltered = (item: TRoute) => {
    const { admin, ...rest } = item;

    return rest;
};

export default (role: RoleType) => {
    const isAdmin = role === 'руководитель';
    const adminFilter = filterAdminRole(isAdmin);

    const routesDictionaries: TRoute[] = [
        {
            path: "/app/in/brands",
            name: "Заказчики",
            admin: true,
        },
        {
            path: "/app/in/legals",
            name: "Юр Лица",
            admin: true,
        },
        {
            path: "/app/in/sites",
            name: "Объекты",
            admin: true,
        },
        {
            path: "/app/in/employees",
            name: "Сотрудники",
            admin: true,
        },
        {
            path: "/app/in/import-sites",
            name: "Импорт",
            admin: true,
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
        },
        {
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