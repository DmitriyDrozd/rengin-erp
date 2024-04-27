import * as Icons from '@ant-design/icons';
import {
    AppstoreOutlined,
    BarChartOutlined,
    CalendarOutlined,
    MailOutlined,
    ReconciliationOutlined
} from '@ant-design/icons';
import React from 'react'
import {
    roleEnum,
    RoleType
} from 'iso/src/store/bootstrap/repos/users';

const RolesMap = {
    admin: roleEnum['руководитель'],
    estimator: roleEnum['сметчик'],
    engineer: roleEnum['инженер'],
    manager: roleEnum['менеджер']
} as const;

type TRoute = {
    path: string,
    name: string,
    icon?: JSX.Element,
    roles?: Array<typeof RolesMap>,
    routes?: TRoute[],
};

const filterAdminRole = (role: RoleType) => (item: TRoute) => {
    if (role === roleEnum['руководитель'] || !item.roles || item.roles.length === 0) {
        return true;
    }

    return item.roles?.includes(role);
};

const mapFiltered = (item: TRoute) => {
    const { roles, ...rest } = item;

    return rest;
};

export default (role: RoleType) => {
    const adminFilter = filterAdminRole(role);

    const routesDictionaries: TRoute[] = [
        {
            path: "/app/in/brands",
            name: "Заказчики",
            roles: [RolesMap.admin],
        },
        {
            path: "/app/in/legals",
            name: "Юр Лица",
            roles: [RolesMap.admin],
        },
        {
            path: "/app/in/sites",
            name: "Объекты",
            roles: [RolesMap.admin, RolesMap.manager],
        },
        {
            path: "/app/in/employees",
            name: "Сотрудники",
            roles: [RolesMap.admin],
        },
        {
            path: "/app/in/import-sites",
            name: "Импорт",
            roles: [RolesMap.admin],
        }
    ].filter(adminFilter).map(mapFiltered);

    const routes: TRoute[] = [
        {
            path: "/app/in/dashboard",
            name: "Дашборд",
            icon: <BarChartOutlined />,
            roles: [RolesMap.admin],
        },
        {
            path: "/app/in/issues",
            name: "Заявки",
            icon: <MailOutlined />,
            roles: [],
        },
        {
            path: "/app/in/expenses",
            name: "Итоговые сметы",
            icon: <ReconciliationOutlined />,
            roles: [RolesMap.admin, RolesMap.manager, RolesMap.estimator],
        },
        {
            path: "/app/in/contracts",
            name: "Договоры",
            icon: <CalendarOutlined />,
            roles: [RolesMap.estimator],
        },
        {
            path: "/app/in/dicts",
            name: "Справочники",
            icon: <AppstoreOutlined />,
            routes: routesDictionaries,
            roles: [RolesMap.admin, RolesMap.manager],
        },
        {
            path: "/app/in/users",
            name: "Пользователи",
            icon: <Icons.UserOutlined/>,
            roles: [RolesMap.admin],
        },
        {
            path: "/app/in/backup",
            name: "Резервная копия  ",
            icon: <Icons.HistoryOutlined/>,
            roles: [RolesMap.admin],
        }
    ].filter(adminFilter).map(mapFiltered);

    return {
        route: {
            routes,
        },
        appList: [],
    }
}