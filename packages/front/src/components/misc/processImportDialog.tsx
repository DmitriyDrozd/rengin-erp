import React from 'react';
import { ExclamationCircleFilled } from '@ant-design/icons';
import {Button, Card, Modal, Space} from 'antd';
import Meta from 'antd/es/card/Meta'

const { info } = Modal;

export const processImportDialog = async () => {
   const result = await info({
        title:'Импорт заказчиков и объектов',
        icon: <ExclamationCircleFilled />,
        content: <div>
            <Card
                hoverable
                style={{ width: 240 }}
                cover={<img alt="example" src="/assets/import-objects-example.png" />}
            >
                <Meta title="Europe Street beat" description="www.instagram.com" />
            </Card>
        </div>,
        onOk() {
            return new Promise((resolve, reject) => {
                setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
            }).catch(() => console.log('Oops errors!'));
        },
        onCancel() {},

    })

}