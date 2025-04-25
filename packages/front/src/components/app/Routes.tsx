import * as Icons from '@ant-design/icons';
import {
    AppstoreOutlined,
    BarChartOutlined,
    BulbOutlined,
    CalendarOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    HeartOutlined,
    MailOutlined,
    ReconciliationOutlined,
    TeamOutlined
} from '@ant-design/icons';
import React from 'react'
import {
    roleEnum,
    RoleType
} from 'iso/src/store/bootstrap/repos/users';
import { isUserCustomer } from '../../utils/userUtils';

const RolesMap = {
    admin: roleEnum['руководитель'],
    estimator: roleEnum['сметчик'],
    engineer: roleEnum['инженер'],
    manager: roleEnum['менеджер'],
    staffManager: roleEnum.staffManager,
} as const;

type TRoute = {
    path: string,
    name: string,
    icon?: JSX.Element,
    roles?: Array<typeof RolesMap>,
    isCustomerRestricted?: boolean,
    routes?: TRoute[],
};

const filterRole = (role: RoleType, isCustomer: boolean) => (item: TRoute): boolean => {
    if (item.isCustomerRestricted && isCustomer) {
        return false;
    }

    if (role === roleEnum['руководитель'] || !item.roles || item.roles.length === 0) {
        return true;
    }

    return item.roles?.includes(role);
};

const mapFiltered = (item: TRoute) => {
    const { roles, isCustomerRestricted, ...rest } = item;

    return rest;
};

export default (user) => {
    const role: RoleType = user.role;
    const isCustomer = isUserCustomer(user);
    const roleFilter = filterRole(role, isCustomer);

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
            path: "/app/in/import-sites",
            name: "Импорт",
            roles: [RolesMap.admin],
        }
    ].filter(roleFilter).map(mapFiltered);

    const routesEmployees: TRoute[] = [
        {
            path: "/app/in/employees/provided",
            name: "Предварительный поиск",
            icon: <Icons.UsergroupAddOutlined />,
            roles: [RolesMap.admin, RolesMap.staffManager, RolesMap.manager],
        },
        {
            path: "/app/in/employees/checked",
            name: "Проверенные специалисты",
            icon: <HeartOutlined />,
            roles: [RolesMap.admin, RolesMap.staffManager, RolesMap.manager],
        },
        {
            path: "/app/in/employees/blacklist",
            name: "Черный список",
            icon: <CloseCircleOutlined />, 
            roles: [RolesMap.admin, RolesMap.staffManager, RolesMap.manager],
        },
    ].filter(roleFilter).map(mapFiltered);

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
            path: "/app/in/employees",
            name: "Сотрудники",
            icon: <TeamOutlined />,
            routes: routesEmployees,
            roles: [RolesMap.admin, RolesMap.staffManager, RolesMap.manager],
        },
        {
            path: "/app/in/users",
            name: "Пользователи",
            icon: <Icons.UserOutlined/>,
            roles: [RolesMap.admin],
        },
        {
            path: "/app/in/tasks",
            name: "Задачи",
            icon: <Icons.ToolOutlined />,
            roles: [],
            isCustomerRestricted: true,
        },
        {
            path: "/app/in/backup",
            name: "Резервная копия  ",
            icon: <Icons.HistoryOutlined/>,
            roles: [RolesMap.admin],
        }
    ].filter(roleFilter).map(mapFiltered);

    return {
        route: {
            routes,
        },
        appList: [],
    }
}