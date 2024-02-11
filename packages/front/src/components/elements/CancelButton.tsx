import {AntdIcons} from './AntdIcons'
import {Button} from 'antd'
import React from 'react'

export default ({onCancel,disabled}:{onCancel: Function, disabled?: boolean}) => {
    return <Button icon={<AntdIcons.CloseOutlined/>} disabled={disabled} onClick={onCancel as any} >Отмена</Button>
}