import {Header} from 'antd/es/layout/layout'
import React from 'react'
import HeadLogo from '../app/HeadLogo'
import ProfileTopBar from './ProfileTopBar'

export default () => {
    return  <Header style={{ display: 'flex', alignItems: 'center', justifyContent:'space-between' }}>
                <HeadLogo />
                <ProfileTopBar></ProfileTopBar>
            </Header>
}