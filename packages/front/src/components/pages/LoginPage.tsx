import {Button, Card, Checkbox, Form, Input, notification, Row, Spin} from 'antd';
import * as React from 'react'
import {useState} from 'react'
import {useHistory} from 'react-router'
import useFrontStore from '../../hooks/common/useFrontStore'
import useFrontDispatch from '../../hooks/common/useFrontDispatch'
import {appStorage} from 'iso'
import {uiDuck} from '../../store/ducks/uiDuck'
import getRestApi from 'iso/src/getRestApi'
import Icon from 'antd/es/icon'
import getFrontEnv from '../../getFrontEnv'
import {Link} from 'react-router-dom'
import {nav} from '../nav'
import {AntdIcons} from '../elements/AntdIcons'
import useUI from "../../hooks/common/useUI";
import {sleep} from "@sha/utils";

export default () => {
    const [notify, contextHolder] = notification.useNotification();

    const dispatch = useFrontDispatch()
const ui = useUI()
    const history = useHistory()
    const store = useFrontStore()
    const [visible, setVisible] = useState(false)

    const [email, setEmail] = useState(getFrontEnv().RENGIN_MOCK_INPUTS ? 'miramaxis@gmail.com' : undefined)
    const [password, setPassword] = useState(getFrontEnv().RENGIN_MOCK_INPUTS ? '123456' : undefined)
    const [remember, setRemember] = useState(false)

    const [loading, setLoading] = useState(false)


    const onSubmit = async (e) => {

        e.preventDefault()

        if (!password) {

            return
        }
        const params = {password, email, remember, pathname: window.location.pathname}
        const body = JSON.stringify(params)
        setLoading(true)
        try {
            const api = await getRestApi()
            const response = await api.login(params)
            if (response) {


                if (params.remember) {
                    appStorage.setItem('credentials', params)
                } else {
                    appStorage.removeItem('credentials')
                }
                //  store.rusSaga(loginSaga, history)
                dispatch(uiDuck.actions.loginRequested(params))

            } else {

                const data = await response.json()

                dispatch(uiDuck.actions.unbusy('Login'))
                notify.error({message:'Неверный логин/пароль'})


            }
        } catch (e) {
            dispatch(uiDuck.actions.unbusy('Login'))
            notify.error({message:'Не удалось авторизоваться'})

        }
        await sleep(1000)
        setLoading(false)
    }

        return (
            <Spin spinning={loading || ui.busy.length !== 0}>
                <Row type="flex" justify="center" align="middle" style={{minHeight: '100vh'}}>
                    <Card title={'Авторизация'} actions={[
                        <Checkbox checked={remember} onChange={e => setRemember(e.target.checked)}>Запомнить</Checkbox>,
                        <Link to={nav.forgot({})}>
                            Забыли пароль ?
                        </Link>,
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="login-form-button"
                            onClick={onSubmit}
                            loading={loading || ui.busy.length !== 0}
                            icon={<AntdIcons.LoginOutlined/>}
                        >
                            Логин
                        </Button>
                    ]}>
                <Form  className="login-form" style={{minWidth: '400px'}}
                       labelCol={{ span: 4 }}
                       wrapperCol={{ span: 20 }}
                >
                    <Form.Item label={<AntdIcons.UserOutlined/>} >
                        {contextHolder}
                            <Input
                                value={email}
                                onChange={ e=> setEmail(e.target.value)}
                                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                placeholder="Username"
                            />
                    </Form.Item>
                    <Form.Item label={<AntdIcons.SecurityScanOutlined/>}>

                            <Input.Password
                                value={password}
                                onChange={ e=> setPassword(e.target.value)}
                                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                type="password"
                                placeholder="Password"
                            />

                    </Form.Item>

                </Form>
                    </Card>
                </Row>
            </Spin>

        );

}

