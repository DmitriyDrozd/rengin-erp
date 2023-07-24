import {Button, FloatButton} from 'antd'
import {AntdIcons} from './AntdIcons'
import {useHistory} from 'react-router'

export default ({href}: {href?: string}) => {
    const history = useHistory()

    const onButtonClick = () => {
        if(href)
            history.push(href)
    }
    return <Button type={'primary'} icon={<AntdIcons.PlusCircleOutlined/>} onClick={onButtonClick}>Создать</Button>
}