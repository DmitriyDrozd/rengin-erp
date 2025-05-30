import {
    Content,
    Header
} from 'antd/es/layout/layout';
import React, { useEffect, useState } from 'react';
import {
    Card,
    Layout,
    Row,
    Select,
    Switch
} from 'antd';
import disposeGlobalPreloader from '../../utils/disposeGlobalPreloader';
import HeadLogo from '../app/HeadLogo';
import Form from 'antd/es/form';
import Input from 'antd/es/input';
import Button from 'antd/es/button';
import TextArea from 'antd/es/input/TextArea';
import Typography from 'antd/es/typography/Typography';
import SafetyOutlined from '@ant-design/icons/lib/icons/SafetyOutlined';
import Space from 'antd/es/space';
import { useNotifications } from '../../hooks/useNotifications';
import Result from 'antd/es/result';
import { getNav } from '../getNav';
import { Link } from 'react-router-dom';

const headerHeight = 84;
const contentMinHeight = `calc(100vh - ${headerHeight}px)`;

const categoryOptions = [
    {
        label: 'Жалоба',
        value: 'complaint',
    },
    {
        label: 'Предложение',
        value: 'proposal',
    }
];

const FEEDBACK_CONSUMER_ID = 'vXAB7h90bgMNqiQ';

interface IFeedbackFormProps {
    category: string;
    title: string;
    description: string;
    anonymous: boolean;
    name: string;
}

const App = () => {
    useEffect(disposeGlobalPreloader, []);
    const notifications = useNotifications('feedback');

    const [isAnonymous, setIsAnonymous] = useState(true);
    const [isFeedbackSent, setIsFeedbackSent] = useState<boolean|string>(false);

    const onFinish = (values: IFeedbackFormProps) => {
        const author = values.anonymous ? 'аноним' : values.name;
        const message = `Тема: ${values.title}. Описание: ${values.description}. Отправитель - ${author}`;

        notifications.sendNotification({
            createdBy: 'feedback',
            timestamp: new Date(),
            createdLink: location.pathname + location.hash,
            title: 'Сообщение с формы жалоб и предложений',
            message: message,
            destination: FEEDBACK_CONSUMER_ID,
        });

        setIsFeedbackSent(values.category);
    };

    const getResultContent = () => {
        const category = isFeedbackSent === 'complaint' ? 'Жалоба' : 'Предложение';
        const noun = isFeedbackSent === 'complaint' ? 'а' : 'о';
        const withNoun = (label: string) => `${label}${noun}`;

        return (
            <Result
                status="success"
                title={`${category} ${withNoun('принят')}`}
                subTitle={`${category} ${withNoun('отправлен')} и будет рассмотрен${noun} в ближайшее время.`}
                extra={[
                    <Link to={getNav().login} key={'login'}>
                        <Button type="primary" key="console">
                            Вернуться
                        </Button>
                    </Link>,
                ]}
            />
        )
    };

    const getFormContent = () => (
        <Form
                            name="feedback"
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}
                            initialValues={{ isAnonymous: true }}
                            onFinish={onFinish}
                            autoComplete="off"
                        >
                            <Form.Item
                                label="Категория"
                                name="category"
                                initialValue='complaint'
                            >
                                <Select
                                    options={categoryOptions}
                                />
                            </Form.Item>

                            <Form.Item
                                label="Тема"
                                name="title"
                                rules={[{ required: true, message: 'Опишите проблему' }]}
                            >
                                <TextArea placeholder='Тема'/>
                            </Form.Item>

                            <Form.Item
                                label="Предложение"
                                name="description"
                                rules={[{ required: false, message: 'Предложите своё видение решения проблемы' }]}
                            >
                                <TextArea placeholder='Предложение'/>
                            </Form.Item>

                            <Form.Item label="Отправить анонимно" name="anonymous" valuePropName="checked" initialValue="checked">
                                <Switch defaultChecked onChange={setIsAnonymous}/>
                                    <Space style={{ paddingTop: 12, color: '#555' }}>
                                        <SafetyOutlined style={{ fontSize: 24 }}/> 
                                        <Typography style={{ opacity: 0.8, maxWidth: '70%' }}>
                                            Мы не собираем информацию, 
                                            с помощью которой можно определить отправителя.
                                            В случае необходимости обратной связи
                                            отключите переключатель и оставьте ваше ФИО ниже
                                        </Typography>
                                    </Space>
                            </Form.Item>

                            <Form.Item
                                label="ФИО"
                                name="name"
                                rules={[{ required: false, message: 'Укажите, как вас зовут' }]}
                                hidden={isAnonymous}
                            >
                                <Input
                                    placeholder='Ваше ФИО'
                                />
                            </Form.Item>

                            <Form.Item style={{ paddingTop: 24 }} wrapperCol={{ offset: 8, span: 16 }}>
                                <Button type="primary" htmlType="submit">
                                    Отправить
                                </Button>
                            </Form.Item>
                            </Form>
    )

    const content = isFeedbackSent !== false ? getResultContent() : getFormContent();

    return (
        <Layout
            style={{backgroundImage: 'linear-gradient(160deg, rgba(0,158,253,0.7) 0%, rgba(14,235,249,0.3) 62%, rgba(42,245,185,0.7) 100%)'}}>
            <Header style={{
                height: headerHeight,
                background: 'rgba(0,21,41,0.5)'
            }}>
                <HeadLogo textColor="#fff" style={{width: 220, height: headerHeight}}/>
            </Header>
            <Content>
                <Row type="flex" justify="center" align="middle" style={{minHeight: contentMinHeight}}>
                    <Card title={'Жалобы и предложения'} style={{ borderRadius: 12, minWidth: '30%' }}>
                        {content}
                    </Card>
                </Row>
            </Content>
        </Layout>
    );
}

export default App;