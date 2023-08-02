import useFrontSelector from './useFrontSelector';
import {uiDuck} from '../../store/ducks/uiDuck';
import {useDispatch} from 'react-redux';

export default () => {
    const isSweepMode = useFrontSelector(uiDuck.selectSweepMode)
    const dispatch = useDispatch()

    const setSweepMode =(value: boolean) => {

            dispatch( value ? uiDuck.actions.sweepModeOn(undefined) : uiDuck.actions.sweepModeOff(undefined))
    }

    const sweepOff=() => setSweepMode(false)

    const sweepOn =() => setSweepMode(true)
    return {
        isSweepMode,
        setSweepMode,
        sweepOff,
        sweepOn
    }
}