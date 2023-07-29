import React, { useState } from 'react';
import {
    AppstoreOutlined,
    CalendarOutlined,
    LinkOutlined,
    MailOutlined,
    SettingOutlined,
} from '@ant-design/icons';
import * as Icons from '@ant-design/icons'
import { Divider, Menu, Switch } from 'antd';
import type { MenuProps } from 'antd/es/menu';
import {useHistory, useLocation} from 'react-router'
import {SelectInfo} from 'antd/es/calendar/generateCalendar'

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
        label
    } as MenuItem;
}

const items: MenuItem[] = [
    getItem('Главная','start',<Icons.HomeOutlined/>),
    getItem('Сотрудники','users',<Icons.UserOutlined/>),
    getItem('Заявки', 'issues', <MailOutlined />),
    getItem('Договора', 'contracts', <CalendarOutlined />),
    getItem('Адреса', 'addresses', <AppstoreOutlined />),
];

const App: React.FC = () => {


    const history  = useHistory()
    const location = useLocation()
    const segment = location.pathname.split('/')[2]
    console.log('segment', segment)

    return (

            <Menu
                theme={'light'}
                selectedKeys={[segment]}
                onSelect={e =>{
                    console.log('Menu-> onSelect', e)
                    history.push('/app/in/'+e.key)
                }}
                items={items}
            />

    );
};

export default App;