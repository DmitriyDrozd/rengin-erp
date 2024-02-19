import {useSelector} from 'react-redux';
import {uiSlice, UIState} from '../../store/uiSlice';

export default () => {
    const state: UIState = useSelector(uiSlice.selectSlice)
    return state
}
