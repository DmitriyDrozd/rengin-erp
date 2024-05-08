import {
    Content,
    Header
} from 'antd/es/layout/layout';
import React, { useEffect } from 'react';
import {
    Button,
    Card,
    Layout,
    Result,
    Row
} from 'antd';
import { Link } from 'react-router-dom';
import disposeGlobalPreloader from '../../utils/disposeGlobalPreloader';
import HeadLogo from '../app/HeadLogo';
import { getNav } from '../getNav';

const adminEmail = 'rmishlanov@rengin.ru';
const adminNumber = '89139360584';

const App = () => {
    useEffect(disposeGlobalPreloader, []);

    return (
        <Layout
            style={{backgroundImage: 'linear-gradient(160deg, rgba(0,158,253,0.7) 0%, rgba(14,235,249,0.3) 62%, rgba(42,245,185,0.7) 100%)'}}>
            <Header style={{
                height: 84,
                background: 'rgba(0,21,41,0.5)'
            }}>
                <HeadLogo textColor="#fff" style={{width: 220, height: 84}}/>
            </Header>
            <Content>
                <Row type="flex" justify="center" align="middle" style={{minHeight: 'calc(100vh - 84px)'}}>
                    <Card title={'Восстановление пароля'}>
                        <Result
                            status="info"
                            title="Для восстановления доступа обратитесь к администратору"
                            subTitle={`по почте: ${adminEmail}, или по номеру телефона: ${adminNumber}`}
                            extra={[
                                <Link to={getNav().login} key={'login'}>
                                    <Button type="primary" key="console">
                                        Вернуться
                                    </Button>
                                </Link>,
                            ]}
                        />
                    </Card>
                </Row>
            </Content>
        </Layout>
    );
}

export default App;