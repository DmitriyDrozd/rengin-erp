import useFrontSelector from "./common/useFrontSelector";
import {selectCurrentUser} from "../store/frontReducer";
import {UserVO} from 'iso/src/store/bootstrap/repos/user-schema'
import {usersCrud} from 'iso/src/store/bootstrap'

export default (userId: string = undefined as any as string) => {
    const user: UserVO = useFrontSelector(usersCrud.selectById(userId))
    const currentUser: UserVO = useFrontSelector(selectCurrentUser)
    return user || currentUser

}
