import {DownOutlined, LogoutOutlined} from '@ant-design/icons';
import type {PageContainerProps, ProLayoutProps, ProSettings} from '@ant-design/pro-components'
import {PageContainer, ProLayout} from '@ant-design/pro-components'
import {Dropdown, DropDownProps, Space, theme, Typography} from 'antd'
import React from 'react'
import defaultProps from './defaultLayoutProps'

import {Link, useNavigate} from 'react-router-dom'
import {USERS} from 'iso'
import useCurrentUser from '../../hooks/useCurrentUser'
import useAdminState from '../../hooks/common/useAdminState'
import HeadLogo from './HeadLogo'
import {AntdIcons} from '../../components/elements/AntdIcons'
import useUI from "../../hooks/common/useUI";
import {pathnames} from "../pathnames";
import {useLocation} from "react-router";

const { useToken } = theme;


const TopProfileDropDown = (props: DropDownProps)=> {

    const navigate = useNavigate();
    const onConfirmExit = async () => {
        navigate(pathnames.LOGIN)
    }
    return (
        <Dropdown
            trigger={['click']}
            {...props}
            menu={{
                items: [
                    {
                        onClick: () => {
                            onConfirmExit()
                        },
                        danger: true,
                        key: 'logout',
                        icon: <LogoutOutlined/>,
                        label: 'Выйти',
                    },
                ],
            }}

        >
            {props.children}
        </Dropdown>
    )
}
export default ({proLayout, children,hidePageContainer, ...props}: PageContainerProps & {proLayout?: ProLayoutProps,hidePageContainer?:boolean}) => {
    const ui = useUI()
    const settings: Partial<ProSettings> | undefined = {
        fixSiderbar: true,
        layout: "mix",
        splitMenus: false
    };
    const currentUser = useCurrentUser()
    const userAvatarURL = useAdminState(USERS.selectAvatar(currentUser.id))

    const location = useLocation()
    const pathname = location.pathname

    return (

            <ProLayout
                breakpoint={false}
                loading={ui.busy.length !==0}
                collapsed={false}
                bgLayoutImgList={[
                    {
                        src:
                            "https://img.alicdn.com/imgextra/i2/O1CN01O4etvp1DvpFLKfuWq_!!6000000000279-2-tps-609-606.png",
                        left: 85,
                        bottom: 100,
                        height: "303px"
                    },
                    {
                        src:
                            "https://img.alicdn.com/imgextra/i2/O1CN01O4etvp1DvpFLKfuWq_!!6000000000279-2-tps-609-606.png",
                        bottom: -68,
                        right: -45,
                        height: "303px"
                    },
                    {
                        src:
                            "https://img.alicdn.com/imgextra/i3/O1CN018NxReL1shX85Yz6Cx_!!6000000005798-2-tps-884-496.png",
                        bottom: 0,
                        left: 0,
                        width: "331px"
                    }
                ]}
                {...defaultProps(currentUser.role)}
                location={{
                    pathname
                }}
                logo={<HeadLogo/>}
                title={'Rengin'}
                avatarProps={{
                    icon:<AntdIcons.ArrowDownOutlined/>,
                    src: userAvatarURL,
                    size: "small",
                    title: <Typography.Link><Typography.Text type={"success"}>{currentUser.role}</Typography.Text> {currentUser.email}</Typography.Link>,
                    render: (props, dom) =>
                        <TopProfileDropDown {...props}><Space>{dom}<a href={'#'}><DownOutlined/></a></Space></TopProfileDropDown>
                }}

                menuFooterRender={(props) => {
                    if (props?.collapsed) return undefined;
                    return (
                        <div
                            style={{
                                textAlign: "center",
                                paddingBlockStart: 12
                            }}
                        >
                            <div>© 2023 rengindesk.ru</div>
                        </div>
                    );
                }}
                collapsedButtonRender={() => null}

                onMenuHeaderClick={e =>
                {
                    console.log(e)
                    debugger
                }

                }


                menuItemRender={(item, dom) => {
                    //console.log(item)
                   return  <Link to={item.path}>
                        {dom}
                    </Link>
                }}
                {...settings}
                {...proLayout}
            >

              {hidePageContainer ?
                    children
                    :  <PageContainer {...props}


                    >

                        {children}

                    </PageContainer>
                }

            </ProLayout>
    );
};
