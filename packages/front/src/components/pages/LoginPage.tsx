import {
    Button,
    Card,
    Checkbox,
    Form,
    Input,
    Layout,
    notification,
    Row,
    Spin
} from 'antd';
import {
    Content,
    Header
} from 'antd/es/layout/layout';
import * as React from 'react';
import { useState } from 'react';
import useFrontDispatch from '../../hooks/common/useFrontDispatch';
import { appStorage } from 'iso';
import { uiDuck } from '../../store/ducks/uiDuck';
import getRestApi from 'iso/src/getRestApi';
import Icon from 'antd/es/icon';
import { Link } from 'react-router-dom';
import HeadLogo from '../app/HeadLogo';
import { getNav } from '../getNav';
import { AntdIcons } from '../elements/AntdIcons';
import useUI from '../../hooks/common/useUI';
import { sleep } from '@sha/utils';
import Space from 'antd/es/space';
import FileProtectOutlined from '@ant-design/icons/lib/icons/FileProtectOutlined';

const headerHeight = 84;
const footerHeight = 50;
const contentMinHeight = `calc(100vh - ${headerHeight + footerHeight}px)`;

export default () => {
    const [notify, contextHolder] = notification.useNotification();

    const dispatch = useFrontDispatch();
    const ui = useUI();

    const [email, setEmail] = useState(undefined);
    const [password, setPassword] = useState(undefined);
    const [remember, setRemember] = useState(false);

    const [loading, setLoading] = useState(false);

    const onSubmit = async (e) => {

        e.preventDefault();

        if (!password) {
            return;
        }

        const params = {password, email, remember, pathname: window.location.pathname};
        setLoading(true);

        try {
            const api = await getRestApi();
            const response = await api.login(params);

            if (response) {
                if (params.remember) {
                    appStorage.setItem('credentials', params);
                } else {
                    appStorage.removeItem('credentials');
                }
                //  store.rusSaga(loginSaga, history)
                dispatch(uiDuck.actions.loginRequested(params));
            } else {
                const data = await response.json();

                dispatch(uiDuck.actions.unbusy('Login'));
                notify.error({message: 'Неверный логин/пароль'});
            }
        } catch (e) {
            dispatch(uiDuck.actions.unbusy('Login'));
            setLoading(false);
            notify.error({message: 'Не удалось авторизоваться'});
            return;
        }

        await sleep(120000);
        setLoading(false);
    };

    return (
        <Spin spinning={loading || ui.busy.length !== 0}>
            <Layout style={{ backgroundImage: 'linear-gradient(160deg, rgba(0,158,253,0.7) 0%, rgba(14,235,249,0.3) 62%, rgba(42,245,185,0.7) 100%)' }}>
                <Header style={{
                    height: headerHeight,
                    background: 'rgba(0,21,41,0.5)'
                }}>
                    <HeadLogo textColor="#fff" style={{ width: 220, height: 84 }}/>
                </Header>
                <Content>
                    <Row type="flex" justify="center" align="middle" style={{minHeight: contentMinHeight}}>
                        <Card
                            title={'Авторизация'}
                            style={{ borderRadius: 12, overflow: 'hidden' }}
                            actions={[
                                <Checkbox checked={remember} onChange={e => setRemember(e.target.checked)}>Запомнить</Checkbox>,
                                <Link to={getNav().forgot}>
                                    Забыли пароль ?
                                </Link>,
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    className="login-form-button"
                                    onClick={onSubmit}
                                    loading={loading || ui.busy.length !== 0}
                                    icon={<AntdIcons.LoginOutlined/>}
                                    style={{
                                        backgroundImage: 'linear-gradient(160deg, rgba(0,158,253,0.7) 0%,rgba(42,245,152,0.7) 100%)',
                                    }}
                                >
                                    Войти
                                </Button>
                            ]
                        }>
                            <Form className="login-form" style={{minWidth: '400px'}}
                                  labelCol={{span: 4}}
                                  wrapperCol={{span: 20}}
                            >
                                <Form.Item label={<AntdIcons.UserOutlined/>}>
                                    {contextHolder}
                                    <Input
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                        placeholder="имя (e-mail) пользователя"
                                    />
                                </Form.Item>
                                <Form.Item label={<AntdIcons.SecurityScanOutlined/>}>

                                    <Input.Password
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                        type="password"
                                        placeholder="пароль"
                                    />

                                </Form.Item>

                            </Form>
                        </Card>
                    </Row>
                    <Row type="flex" justify="end" align="middle" style={{minHeight: footerHeight}}>
                        <Link to={getNav().feedback} style={{ color: 'black', fontSize: 16 }}>
                            <Space style={{ gap: 12, paddingRight: 24 }} >
                                <FileProtectOutlined size={24}/>
                                Жалобы и предложения
                            </Space>
                        </Link>
                    </Row>
                </Content>
            </Layout>
        </Spin>

    );

}

