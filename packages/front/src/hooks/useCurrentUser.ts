import useFrontSelector from './common/useFrontSelector';
import {USERS} from "iso";

export const selectCurrentUser = (state: ORM): UserVO => {
    const email = state.ui.login
    const user = USERS.selectUserByEmail(email as any as string)(state)

    return user as any as UserVO
}
export default () => {

    const currentUser = useFrontSelector(selectCurrentUser)

        // const updateGridPreferences  = (gridName, )
    return {
        currentUser,


    }
}
