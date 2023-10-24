import React from 'react';
import * as Icons from '@ant-design/icons';
import {AppstoreOutlined, BarChartOutlined, CalendarOutlined, MailOutlined} from '@ant-design/icons';
import {Menu} from 'antd';
import type {MenuProps} from 'antd/es/menu';
import {useHistory, useLocation} from 'react-router'
import useCurrentUser from "../../hooks/useCurrentUser";

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
    const {currentUser} = useCurrentUser()
    const userItems = currentUser.role === 'руководитель' ?
         [
             getItem('Дашбор','dashboard', <BarChartOutlined />),
             ...items
         ] : items;

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
                items={userItems}
            />

    );
};

export default App;