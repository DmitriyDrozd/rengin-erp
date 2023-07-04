import React, { useState } from 'react';
import {
    AppstoreOutlined,
    CalendarOutlined,
    LinkOutlined,
    MailOutlined,
    SettingOutlined,
} from '@ant-design/icons';
import { Divider, Menu, Switch } from 'antd';
import type { MenuProps, MenuTheme } from 'antd/es/menu';

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
    label: React.ReactNode,
    key?: React.Key | null,
    icon?: React.ReactNode,
    children?: MenuItem[],
): MenuItem {
    return {
        key,
        icon,
        children,
        label,
    } as MenuItem;
}

const items: MenuItem[] = [
    getItem('Заявки', '1', <MailOutlined />),
    getItem('Договора', '2', <CalendarOutlined />),
    getItem('Оплаты', 'sub1', <AppstoreOutlined />),
    getItem('Справочники', 'sub2', <SettingOutlined />, [
        getItem('Статусы', '7'),
        getItem('Заказчики', '8'),
        getItem('Сотрудники', '9'),
        getItem('Адреса', '10'),
    ]),
    getItem(
        <a href="https://ant.design" target="_blank" rel="noopener noreferrer">
            Настройки
        </a>,
        'link',
        <LinkOutlined />,
    ),
];

const App: React.FC = () => {
    const [mode, setMode] = useState<'vertical' | 'inline'>('inline');
    const [theme, setTheme] = useState<MenuTheme>('light');

    const changeMode = (value: boolean) => {
        setMode(value ? 'vertical' : 'inline');
    };

    const changeTheme = (value: boolean) => {
        setTheme(value ? 'dark' : 'light');
    };

    return (

            <Menu

                defaultSelectedKeys={['1']}
                defaultOpenKeys={['sub1']}
                mode={mode}
                theme={theme}
                items={items}
            />

    );
};

export default App;