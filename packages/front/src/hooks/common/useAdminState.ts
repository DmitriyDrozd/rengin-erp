import {useSelector} from 'react-redux'
import {AdminState} from "../../app/buildAdminStore";


export const useAdminState = <Selected = AdminState> (selector: (state: AdminState) => Selected ) => useSelector(selector)

export default useAdminState
