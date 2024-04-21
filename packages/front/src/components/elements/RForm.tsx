import React from 'react';
import { ProFormProps } from '@ant-design/pro-form/es/layouts/ProForm';
import { ProForm } from '@ant-design/pro-components';
import {
    Row,
    Space
} from 'antd';

export const RForm = <T = Record<string, any>>({submitter, ...props}: ProFormProps<T> & {
    children?: React.ReactNode | React.ReactNode[];
}) => {
    return (
        <ProForm<T>
            submitter={{
                searchConfig: {
                    resetText: 'Отмена',

                    submitText: 'Сохранить',
                },
                // Configure the properties of the button
                resetButtonProps: {},
                submitButtonProps: {},
                render: (props, doms) => {
                    return (
                        <Row style={{display: 'flex', justifyContent: 'flex-end'}}>
                            <Space>{doms}</Space>
                        </Row>
                    );
                },
                ...submitter,
            }}
            {...props}
        />
    );
};