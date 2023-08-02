import {Button} from 'antd'
import {AntdIcons} from './AntdIcons'
import {useHistory} from 'react-router'
import usePathnameResource from '../../hooks/usePathnameResource'
import getCrudPathname from '../../hooks/getCrudPathname'

export default ({href}: {href?: string}) => {
    const pathRes = usePathnameResource()
    const url = href || getCrudPathname(pathRes.resource).create()
    const history = useHistory()

    const onButtonClick = () => {
            history.push(url)
    }
    return <Button type={'primary'} icon={<AntdIcons.PlusSquareOutlined/>} onClick={onButtonClick}>Создать</Button>
}