import useAdminState from './common/useAdminState';
import {USERS, UserVO} from "iso";
import {AdminState} from "../app/buildAdminStore";

export const selectCurrentUser = (state: AdminState): UserVO => {
    const userId = state.dispatcher.userId
    const user = USERS.selectors.selectById(userId)(state)

    return user as any as UserVO
}
export default () => {

    const currentUser = useAdminState(selectCurrentUser)

        // const updateGridPreferences  = (gridName, )
    return currentUser
}
