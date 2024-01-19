import React from 'react'
import {ProFormProps} from '@ant-design/pro-form/es/layouts/ProForm'
import {ProForm} from '@ant-design/pro-components'

export const layoutPropsModalForm = {
    labelCol: { span: 6 },
    wrapperCol: { span:18 },
}
export const ModalForm = <T = Record<string, any>>({submitter, ...props}: ProFormProps<T> & {
    children?: React.ReactNode | React.ReactNode[];
}) => {
    return <ProForm<T>
        {
            ...layoutPropsModalForm
        }
        submitter={{
            render: (props) => null
        }}
        {...props}
    />
}