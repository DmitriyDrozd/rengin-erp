import useFrontSelector from './common/useFrontSelector';
import {selectCurrentUser} from '../store/frontReducer';
import {USERS, UserVO} from 'iso/src/store/bootstrap/repos/users'

export default (userId: string = undefined as any as string) => {
    const user: UserVO = useFrontSelector(USERS.selectById(userId))
    const currentUser: UserVO = useFrontSelector(selectCurrentUser)
    return user || currentUser

}
