import {useSelector} from 'react-redux'
import useUser from '../../hooks/useUser'
import {Avatar} from 'antd'

import {Link} from 'react-router-dom'
import {nav} from '../nav'
import USERS from 'iso/src/store/bootstrap/repos/users'

export default ({userId}:{userId: string}) => {
    const user = useUser(userId)
    const url = useSelector(USERS.selectAvatar(userId))
    return         <Link to={nav.userPage({userId})}>
        <Avatar src={url} ></Avatar></Link>
}