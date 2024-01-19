import React, {useState} from 'react';
import {Layout, Spin, theme} from 'antd';
import {Switch} from '@sha/router'


import {rootRoutes} from '../getNav'
import {useSelector} from 'react-redux'
import {uiDuck} from '../../store/ducks/uiDuck'

const { Header, Content, Sider } = Layout;

const UIRoot: React.FC = (props: {history}) => {
    const [routes] = useState(rootRoutes())
    const {
        token: { colorBgContainer },
    } = theme.useToken();
    const ui = useSelector(uiDuck.selectUI)
    return ui.preloaded ? <Switch>{
           routes
    }</Switch> : <Layout><Spin spinning={true}></Spin></Layout>
};

export default UIRoot;