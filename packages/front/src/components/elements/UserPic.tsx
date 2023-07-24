import {useSelector} from 'react-redux'
import useUser from '../../hooks/useUser'
import {Avatar} from 'antd'
import {usersCrud} from 'iso/src/store/bootstrap'

import {Link} from 'react-router-dom'
import {nav} from '../nav'

export default ({userId}:{userId: string}) => {
    const user = useUser(userId)
    const url = useSelector(usersCrud.selectAvatar(userId))
    return         <Link to={nav.userPage({userId})}>
        <Avatar src={url} ></Avatar></Link>
}