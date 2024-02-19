import useAdminState from './common/useAdminState';
import {USERS, UserVO} from 'iso'
import {selectCurrentUser} from "./useCurrentUser";

export default (userId: string = undefined as any as string) => {
    const user: UserVO = useAdminState(USERS.selectors.selectById(userId))
    const currentUser: UserVO = useAdminState(selectCurrentUser)
    return user || currentUser

}
