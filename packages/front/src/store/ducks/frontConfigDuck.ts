import * as FSA from '@sha/fsa';


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
    selectFrontConfig: (state): FrontConfig =>
        state.frontConfig,


    reducer: (state = defaultConfig, action): FrontConfig => {
        if (actions.reset.isType(action))
            return action.payload

        return state
    }
}

export default frontConfigDuck

