import {
    DownOutlined,
    LogoutOutlined
} from '@ant-design/icons';
import type {
    PageContainerProps,
    ProLayoutProps,
    ProSettings
} from '@ant-design/pro-components';
import {
    PageContainer,
    ProLayout
} from '@ant-design/pro-components';
import {
    Dropdown,
    DropDownProps,
    Space,
    Typography
} from 'antd';
import React, { useState } from 'react';
import routes from './Routes';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import USERS from 'iso/src/store/bootstrap/repos/users';
import useCurrentUser from '../../hooks/useCurrentUser';
import useFrontSelector from '../../hooks/common/useFrontSelector';
import useFrontDispatch from '../../hooks/common/useFrontDispatch';
import { uiDuck } from '../../store/ducks/uiDuck';
import { getNav } from '../getNav';
import HeadLogo from '../app/HeadLogo';
import { AntdIcons } from '../elements/AntdIcons';
import useUI from '../../hooks/common/useUI';

// const {useToken} = theme;


const TopProfileDropDown = (props: DropDownProps) => {
    const dispatch = useFrontDispatch();
    const history = useHistory();

    const onConfirmExit = async () => {

        dispatch(uiDuck.actions.logout(undefined));
        history.replace(getNav().login({}));
        window.location.reload();
    };
    return (
        <Dropdown
            trigger={['click']}
            {...props}
            menu={{
                items: [
                    {
                        onClick: () => {
                            onConfirmExit();
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
    );
};
export default ({proLayout, children, hidePageContainer, ...props}: PageContainerProps & {
    proLayout?: ProLayoutProps,
    hidePageContainer?: boolean
}) => {
    const ui = useUI();
    const settings: Partial<ProSettings> | undefined = {
        fixSiderbar: true,
        layout: 'mix',
        splitMenus: false
    };
    const {currentUser} = useCurrentUser();
    const userAvatarURL = useFrontSelector(USERS.selectAvatar(currentUser.userId));

    const history = useHistory();
    const pathname = history.location.pathname;

    const [isCollapsed, setIsCollapsed] = useState(true);

    return (
        <ProLayout
            breakpoint={false}
            loading={ui.busy.length !== 0}
            {...routes(currentUser)}
            location={{
                pathname
            }}
            logo={<HeadLogo/>}
            title={window.location.hostname === 'localhost' ? 'LOCALHOST' : ''}
            avatarProps={{
                icon: <AntdIcons.ArrowDownOutlined/>,
                src: userAvatarURL,
                size: 'small',
                title: <Typography.Link><Typography.Text
                    type={'success'}>{currentUser.role}</Typography.Text> {currentUser.email}</Typography.Link>,
                render: (props, dom) =>
                    <TopProfileDropDown {...props}><Space>{dom}<a
                        href={'#'}><DownOutlined/></a></Space></TopProfileDropDown>
            }}
            menuFooterRender={(props) => {
                if (props?.collapsed) return undefined;
                return (
                    <div
                        style={{
                            textAlign: 'center',
                            paddingBlockStart: 12
                        }}
                    >
                        <div>© 2024 rengindesk.ru</div>
                    </div>
                );
            }}
            menuItemRender={(item, dom) => {
                return (
                    <Link to={item.path}>
                        {dom}
                    </Link>
                );
            }}
            {...settings}
            {...proLayout}
            collapsed={isCollapsed}
            onCollapse={() => {
                setIsCollapsed(!isCollapsed);
            }}
        >
            {hidePageContainer ?
                children
                : (<PageContainer {...props}>
                        {children}
                    </PageContainer>
                )
            }
        </ProLayout>
    );
};
