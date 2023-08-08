import {AntdIcons} from './AntdIcons'
import {Button} from 'antd'
import React from 'react'

export default ({onCancel}:{onCancel: Function}) => {
    return <Button icon={<AntdIcons.CloseOutlined/>} onClick={onCancel as any} >Отмена</Button>
}