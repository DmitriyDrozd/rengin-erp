import React from 'react';
import {Button, Card, Result, Row} from 'antd';
import {Link} from 'react-router-dom'
import {nav} from '../nav'

const App = () => (

        <Row type="flex" justify="center" align="middle" style={{minHeight: '100vh'}}>
            <Card title={'Восстановление пароля'}>
            <Result
        status="info"
        title="Для восстановления доступа обратитесь к администратору admin@rengin.ru tel: +7 9777 666 076) "
        subTitle="Это программное обеспечение на этапе разработки"
        extra={[
            <Link to={nav.login({})}>
            <Button type="primary" key="console">
                Вернуться
            </Button>
            </Link>,

        ]}
    />
            </Card>
        </Row>

);

export default App;