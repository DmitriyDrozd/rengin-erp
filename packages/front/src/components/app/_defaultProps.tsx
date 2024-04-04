import * as Icons from '@ant-design/icons';
import {AppstoreOutlined, BarChartOutlined, CalendarOutlined, ImportOutlined, MailOutlined} from '@ant-design/icons';
import React from 'react'
import {RoleType} from "iso/src/store/bootstrap/repos/users"

export default (role: RoleType) => {
    const isAdmin = role === 'руководитель';
    const adminRoutesInit = isAdmin ?
        [{
            path: "/app/in/dashboard",
            name: "Дашборд",
            icon: <BarChartOutlined />,
        }] : [];

    const adminRoutesRest = isAdmin ?
        [
            // {
            //     path: "/app/in/subs",
            //     name: "Подписки",
            //     icon: <AntdIcons.AccountBookOutlined />,
            // },
            {
                path: "/app/in/dicts",
                name: "Справочники",
                icon: <AppstoreOutlined />,
                routes: [
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
                ]
            },
            {
                path: "/app/in/users",
                name: "Пользователи",
                icon: <Icons.UserOutlined/>
            },
            {
                path: "/app/in/backup",
                name: "Резервная копия  ",
                icon: <Icons.HistoryOutlined/>
            },
        ] : [];

    return {
        route: {
            routes: [
                ...adminRoutesInit,
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
                ...adminRoutesRest
            ],
        },
        appList: [],
    }
}