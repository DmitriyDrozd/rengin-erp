import React, {useState} from 'react';
import { LaptopOutlined, NotificationOutlined, UserOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import {Breadcrumb, Button, Layout, Menu, Modal, Spin, theme} from 'antd';
import TicketsTable from "./pages/TicketsTable";
import TicketForm from "./pages/TicketForm";
import MainMenu from "./app/MainMenu";
import {ConnectedRouter, history, Switch} from '@sha/router'


import {rootRoutes} from './nav'
import {useSelector} from 'react-redux'
import {uiDuck} from '../store/ducks/uiDuck'

const { Header, Content, Sider } = Layout;


const UIRoot: React.FC = (props:{history}) => {
    const {
        token: { colorBgContainer },
    } = theme.useToken();
    const ui = useSelector(uiDuck.selectUI)
    return ui.preloaded ? <Switch>{
            rootRoutes
    }</Switch> : <Layout><Spin spinning={true}></Spin></Layout>
};

export default UIRoot;