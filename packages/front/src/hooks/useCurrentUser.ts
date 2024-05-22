import { UserVO } from 'iso/src/store/bootstrap/repos/users';
import useFrontSelector from './common/useFrontSelector';
import {selectCurrentUser} from '../store/frontReducer';

export default (): { currentUser: UserVO } => {

    const currentUser = useFrontSelector(selectCurrentUser) as UserVO;

        // const updateGridPreferences  = (gridName, )
    return {
        currentUser,
    }
}
