import {RForm} from '../../elements/RForm'
import React, {useRef} from 'react'
import {IssueVO} from 'iso/src/store/bootstrap/repos/issues'
import {ProFormInstance} from '@ant-design/pro-components'

export default () => {
    const layoutProps = {
        labelCol: { span: 6 },
        wrapperCol: { span:18 },
    }
    type Item = IssueVO
    const formRef = useRef<
        ProFormInstance<Item>
    >();
    return <RForm<Item>
        layout={'horizontal'}
        {
            ...layoutProps
        }
        formRef={formRef}
        readonly={false}
        initialValues={initialValues}
        onValuesChange={(_, values) => {
            console.log(values);
            setState(values)
        }}
        onFinish={async (values) => {
            onSubmit(values)
        }}
        onReset={onBack}
        submitter={{
            render: (props) => null
        }}
    >
        {
            renderForm({resource, item: state,id,verb,renderItemInfo})
        }
    </RForm>
}