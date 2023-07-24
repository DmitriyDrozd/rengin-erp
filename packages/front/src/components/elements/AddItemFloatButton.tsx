import {FloatButton} from 'antd'
import {AntdIcons} from './AntdIcons'
import {useHistory} from 'react-router'

export default ({href}: {href?: string}) => {
    const history = useHistory()

    const onButtonClick = () => {
        if(href)
            history.push(href)
    }
    return <FloatButton shape="circle" icon={<AntdIcons.PlusCircleTwoTone/>} onClick={onButtonClick} style={{ right: 24 + 70 + 70 }} />
}