import {AntdIcons} from './AntdIcons'
import {Button} from 'antd'
import React from 'react'

export default ({onCancel, disabled}:{onCancel: Function, disabled?: boolean}) => {
    return <Button icon={<AntdIcons.CloseOutlined/>} onClick={onCancel as any} disabled={disabled}>Отмена</Button>
}