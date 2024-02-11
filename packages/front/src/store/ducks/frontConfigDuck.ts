import * as FSA from '@shammasov/mydux';
import {FrontState} from "../frontReducer";

export const defaultConfig = {
    VERSION: '',
    COMMITHASH: '',
    BRANCH: '',
    LASTCOMMITDATETIME: '',
    LOG_ROCKET: '',
    SERVICE_PORT: 9181,
    WEBPACK_PORT: 9380
}

export type FrontConfig = typeof defaultConfig


const factory = FSA.actionCreatorFactory('frontConfig')
const actions = {
    reset: factory<FrontConfig>('reset'),
}

export const frontConfigDuck = {
    factory,
    actions,
    selectFrontConfig: (state: FrontState): FrontConfig =>
        state.frontConfig,


    reducer: (state = defaultConfig, action: any): FrontConfig => {
        if (actions.reset.isType(action))
            return action.payload

        return state
    }
}

export default frontConfigDuck

