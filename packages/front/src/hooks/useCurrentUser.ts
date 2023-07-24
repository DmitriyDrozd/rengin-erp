import useFrontSelector from "./common/useFrontSelector";
import {selectCurrentUser} from "../store/frontReducer";
import useRole from "./useRole";
import {RoleVO, settingsDuck} from "iso/src/store/bootstrap/settingsDuck";

export default () => {

    const currentUser = useFrontSelector(selectCurrentUser)

    return {
        currentUser,


    }
}
