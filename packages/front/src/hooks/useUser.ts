import useFrontSelector from './common/useFrontSelector';
import {USERS, UserVO} from 'iso'
import {selectCurrentUser} from "./useCurrentUser";

export default (userId: string = undefined as any as string) => {
    const user: UserVO = useFrontSelector(USERS.selectors.selectById(userId))
    const currentUser: UserVO = useFrontSelector(selectCurrentUser)
    return user || currentUser

}
