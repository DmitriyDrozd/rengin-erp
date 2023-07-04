import React, {useState} from 'react';
import { LaptopOutlined, NotificationOutlined, UserOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import {Breadcrumb, Button, Layout, Menu, Modal, theme} from 'antd';
import TicketsPage from "./pages/TicketsPage";
import TicketsTable from "./pages/TicketsTable";
import TicketForm from "./pages/TicketForm";

const { Header, Content, Sider } = Layout;

const items1: MenuProps['items'] = ['1', '2', '3'].map((key) => ({
    key,
    label: `nav ${key}`,
}));

const items2: MenuProps['items'] = [UserOutlined, LaptopOutlined, NotificationOutlined].map(
    (icon, index) => {
        const key = String(index + 1);

        return {
            key: `sub${key}`,
            icon: React.createElement(icon),
            label: `subnav ${key}`,

            children: new Array(4).fill(null).map((_, j) => {
                const subKey = index * 4 + j + 1;
                return {
                    key: subKey,
                    label: `option${subKey}`,
                };
            }),
        };
    },
);

const App: React.FC = () => {
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [modalText, setModalText] = useState('Content of the modal');

    const showModal = () => {
        setOpen(true);
    };

    const handleOk = () => {
        setModalText('The modal will be closed after two seconds');
        setConfirmLoading(true);
        setTimeout(() => {
            setOpen(false);
            setConfirmLoading(false);
        }, 2000);
    };

    const handleCancel = () => {
        console.log('Clicked cancel button');
        setOpen(false);
    };
    return (
        <Layout>
            <Header style={{ display: 'flex', alignItems: 'center' }}>
                <div className="demo-logo" />
                <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']} items={items1} />
            </Header>
            <Layout>
                <Sider width={200} style={{ background: colorBgContainer }}>
                    <Menu
                        mode="inline"
                        defaultSelectedKeys={['1']}
                        defaultOpenKeys={['sub1']}
                        style={{ height: '100%', borderRight: 0 }}
                        items={items2}
                    />
                </Sider>
                <Layout style={{ padding: '0 24px 24px' }}>
                    <Breadcrumb style={{ margin: '16px 0' }}>
                        <Breadcrumb.Item>Home</Breadcrumb.Item>
                        <Breadcrumb.Item>List</Breadcrumb.Item>
                        <Breadcrumb.Item>App</Breadcrumb.Item>
                    </Breadcrumb>
                    <Content
                        style={{
                            padding: 24,
                            margin: 0,
                            minHeight: 280,
                            background: colorBgContainer,
                        }}
                    >
                        <Button onClick={() => showModal()} type={'primary'}>Добавить</Button>
                        <TicketsTable/>
                        <Modal
                            title="Title"
                            open={open}
                            onOk={handleOk}
                            confirmLoading={confirmLoading}
                            onCancel={handleCancel}
                        >
                            <TicketForm/>
                        </Modal>
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    );
};

export default App;