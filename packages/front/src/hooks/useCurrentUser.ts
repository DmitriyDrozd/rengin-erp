import useFrontSelector from './common/useFrontSelector';
import {selectCurrentUser} from '../store/frontReducer';

export default () => {

    const currentUser = useFrontSelector(selectCurrentUser)

        // const updateGridPreferences  = (gridName, )
    return {
        currentUser,


    }
}
