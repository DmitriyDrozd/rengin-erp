import {DownOutlined, LogoutOutlined} from '@ant-design/icons';
import type {PageContainerProps, ProLayoutProps, ProSettings} from '@ant-design/pro-components'
import {PageContainer, ProLayout} from '@ant-design/pro-components'
import {DatePicker, Dropdown, DropDownProps, Space, theme, Typography} from 'antd'
import React from 'react'
import defaultProps from './_defaultProps'
import {useHistory} from 'react-router'
import {Link} from 'react-router-dom'
import USERS from 'iso/src/store/bootstrap/repos/users'
import useCurrentUser from '../../hooks/useCurrentUser'
import useFrontSelector from '../../hooks/common/useFrontSelector'
import useFrontDispatch from '../../hooks/common/useFrontDispatch'
import {uiDuck} from '../../store/ducks/uiDuck'
import {nav} from '../nav'
import HeadLogo from '../app/HeadLogo'
import usePathnameResource from '../../hooks/usePathnameResource'
import {AntdIcons} from '../elements/AntdIcons'

const { useToken } = theme;


const TopProfileDropDown = (props: DropDownProps)=> {
    const dispatch = useFrontDispatch()
    const history = useHistory()
    const onConfirmExit = async () => {

        dispatch(uiDuck.actions.logout(undefined))
        history.replace(nav.login({}))
        window.location.reload()
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

    const settings: Partial<ProSettings> | undefined = {
        fixSiderbar: true,
        layout: "mix",
        splitMenus: false
    };
    const {currentUser} = useCurrentUser()
    const userAvatarURL = useFrontSelector(USERS.selectAvatar(currentUser.userId))

    const history = useHistory()
    const pathname = history.location.pathname

    console.log('ExtraBUTTONS',props.extra)
    const pathRes = usePathnameResource()
    return (

            <ProLayout
                breakpoint={false}

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
                {...defaultProps}
                location={{
                    pathname
                }}

                logo={<HeadLogo/>}
                title={<div>Rengin</div>}
                avatarProps={{
                    icon:<AntdIcons.ArrowDownOutlined/>,
                    src: userAvatarURL,
                    size: "small",
                    title: <Typography.Link>{currentUser.email}</Typography.Link>,
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
                            <div>© 2023 shammasov.com</div>
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
