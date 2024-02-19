import useAdminDispatch from '../../hooks/common/useAdminDispatch'
import {uiSlice} from '../../store/uiSlice'
import {getNav} from '../getNav'
import {Button} from 'antd'
import React from 'react'
import {AntdIcons} from './AntdIcons'
import {useNavigate} from 'react-router-dom'
import {getRestApi} from "iso";
import {pathnames} from "../../app/pathnames";

export default ({onExit}: {onExit?: Function})=> {
    const dispatch = useAdminDispatch()
    const navigate = useNavigate()
    const onConfirmExit = async () => {
        debugger
        await getRestApi().logout()
        navigate(pathnames.LOGIN)
    }

    return  <Button danger type="text" icon={<AntdIcons.LogoutOutlined />} onClick={onConfirmExit}  >
                Выйти lf
            </Button>
}