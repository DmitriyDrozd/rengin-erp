import {Connect, connect} from 'react-redux'
import {FrontState} from './frontReducer';

export const connectRedux = connect as Connect<FrontState>
