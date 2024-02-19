import {Divider, Dropdown, MenuProps, Space, theme, Typography} from 'antd'
import UserPic from '../../components/elements/UserPic'
import useCurrentUser from '../../hooks/useCurrentUser'
import {DownOutlined} from '@ant-design/icons'
import {Link} from 'react-router-dom'
import React from 'react'
import ExitButton from '../../components/elements/ExitButton'
import {generatePath} from "react-router";
import {pathnames} from "../pathnames";

const { useToken } = theme;
const items: MenuProps['items'] = [
    {
        key: '1',
        label: (
            <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
                1st menu item
            </a>
        ),
    },
    {
        key: '2',
        label: (
            <a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
                2nd menu item (disabled)
            </a>
        ),
        disabled: true,
    },
    {
        key: '3',
        label: (
            <a target="_blank" rel="noopener noreferrer" href="https://www.luohanacademy.com">
                3rd menu item (disabled)
            </a>
        ),
        disabled: true,
    },
];

export default () => {
    const currentUser = useCurrentUser()
    const { token } = useToken();

    const contentStyle = {
        backgroundColor: token.colorBgElevated,
        borderRadius: token.borderRadiusLG,
        boxShadow: token.boxShadowSecondary,
    };
    return <Dropdown trigger={['hover']}

                     dropdownRender={(menu) => (
                         <div style={contentStyle}>
                             {menu}
                             <Divider style={{ margin: 0 }} />
                             <Space style={{ padding: 8 }}>
                                <ExitButton/>
                             </Space>
                         </div>
                     )}
    >

        <Link to={generatePath(pathnames.USERS_EDIT,{id:currentUser.id})}>
            <Space>
                <Typography.Text type={'secondary'}>{currentUser.role}</Typography.Text>
                <UserPic userId={currentUser.id}/>
                {currentUser.email}
                <DownOutlined />
            </Space>
        </Link>
    </Dropdown>
}