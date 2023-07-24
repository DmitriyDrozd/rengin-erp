import {TypedUseSelectorHook, useSelector} from 'react-redux'
import {FrontState} from '../../store/frontReducer'

export const useFrontSelector: TypedUseSelectorHook<FrontState> = useSelector


export default useFrontSelector
