import {useSelector} from 'react-redux';
import {Preferences, preferencesDuck} from '../../store/ducks/preferencesDuck';
import useAdminDispatch from './useAdminDispatch';

export type PrefKey = keyof Preferences
export default () => {
    const dispatch = useAdminDispatch()
    const preferences = useSelector(preferencesDuck.selectPreferences)

    return {
        preferences,
        setPref: <K extends PrefKey>(key: K, value: Preferences[K]) => {
            dispatch(preferencesDuck.actions.setKey({key, value}))
        }
    }
}
