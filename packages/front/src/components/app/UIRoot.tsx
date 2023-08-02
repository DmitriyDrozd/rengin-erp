import React from 'react';
import {Layout, Spin, theme} from 'antd';
import {Switch} from '@sha/router'


import {rootRoutes} from '../nav'
import {useSelector} from 'react-redux'
import {uiDuck} from '../../store/ducks/uiDuck'

const { Header, Content, Sider } = Layout;

const UIRoot: React.FC = (props: {history}) => {
    const {
        token: { colorBgContainer },
    } = theme.useToken();
    const ui = useSelector(uiDuck.selectUI)
    return ui.preloaded ? <Switch>{
            rootRoutes
    }</Switch> : <Layout><Spin spinning={true}></Spin></Layout>
};

export default UIRoot;