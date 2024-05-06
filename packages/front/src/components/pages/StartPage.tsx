import React from 'react';
import {ArrowDownOutlined, ArrowUpOutlined} from '@ant-design/icons';
import {Card, Col, Row, Statistic} from 'antd';

import {useSelector} from 'react-redux'
import {bootstrapDuck} from 'iso/src/store/bootstrapDuck'
import AppLayout from '../app/AppLayout'

export default () => {
    const boot = useSelector(bootstrapDuck.selectBootstrap)
    return (
        <AppLayout>

            <Row gutter={[16,16]} style={{marginBottom: '16px', marginTop: '16px'}}>
                <Col span={12}>
                    <Card >
                        <Statistic
                            title="Пользователей"
                            value={boot.users.length}
                            precision={0}
                            valueStyle={{ color: '#3f8600' }}
                            prefix={<ArrowUpOutlined />}
                            suffix=""
                        />
                    </Card>
                </Col>
                <Col span={12}>
                    <Card >
                        <Statistic
                            title="Объекты"
                            value={boot.sites.length}
                            precision={0}
                            valueStyle={{ color: '#3f8600' }}
                            prefix={<ArrowUpOutlined />}
                            suffix=""
                        />
                    </Card>
                </Col>
            </Row>
            <Row gutter={[16,16]}>
                <Col span={12}>
                    <Card bordered={false}>
                        <Statistic
                            title="Договора"
                            value={boot.contracts.length}
                            precision={0}
                            valueStyle={{ color: '#3f8600' }}
                            prefix={<ArrowUpOutlined />}
                            suffix=""
                        />
                    </Card>
                </Col>
                <Col span={12}>
                    <Card bordered={false}>
                        <Statistic
                            title="Заявки"
                            value={boot.issues.length}
                            precision={0}
                            valueStyle={{ color: '#3f8600' }}
                            prefix={<ArrowUpOutlined />}
                            suffix=""
                        />
                    </Card>
                </Col>
            </Row>

        </AppLayout>
    );
}
