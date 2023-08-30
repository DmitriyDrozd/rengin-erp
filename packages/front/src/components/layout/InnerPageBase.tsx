import {Layout} from 'antd'
import MainMenu from './MainMenu'
import React from 'react'
import Sider from 'antd/es/layout/Sider'
import AppHeader from './AppHeader'

export default ({children}) => {
    return      <Layout>
        <AppHeader/>
        <Layout>
            <Sider width={200} >
                <MainMenu/>
            </Sider>
            <Layout style={{ padding: '0 24px 24px' }}>
                {children}
            </Layout>
        </Layout>
    </Layout>
}