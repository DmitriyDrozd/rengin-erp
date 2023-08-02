import useFrontDispatch from '../../hooks/common/useFrontDispatch'
import {uiDuck} from '../../store/ducks/uiDuck'
import {nav} from '../nav'
import {Button} from 'antd'
import React from 'react'
import {AntdIcons} from './AntdIcons'
import {useHistory} from 'react-router'

export default ({onExit}: {onExit?: Function})=> {
    const dispatch = useFrontDispatch()
    const history = useHistory()
    const onConfirmExit = async () => {

        dispatch(uiDuck.actions.logout(undefined))
        history.replace(nav.login({}))
        window.location.reload()
    }

    return  <Button danger type="text" icon={<AntdIcons.LogoutOutlined />} onClick={onConfirmExit}  >
                Выйти
            </Button>
}