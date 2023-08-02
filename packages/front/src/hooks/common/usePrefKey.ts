import {useSelector} from 'react-redux';
import {defaultPreferences, Preferences, preferencesDuck} from '../../store/ducks/preferencesDuck';
import useFrontDispatch from './useFrontDispatch';

export type PrefKey = keyof Preferences
export default <K extends PrefKey>(key: K, defaultValue?: Preferences[K]): [Preferences[K], (newValue: Preferences[K]) => any] => {
    const dispatch = useFrontDispatch()
    const preferences = useSelector(preferencesDuck.selectPreferences)
    const update = (value: Preferences[K]) => {
        dispatch(preferencesDuck.actions.setKey({key, value}))
    }
    return [
        preferences[key] || defaultValue || defaultPreferences[key],
        update
    ]
}
