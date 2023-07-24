import * as FSA from '@sha/fsa';


export const defaultConfig = {}

export type ISOConfig = typeof defaultConfig


const duck = FSA.createBootableDuck('config', defaultConfig as any as ISOConfig)


export const configDuck = {
   ...duck,
    selectConfig: (state): ISOConfig =>
        state.app.config,
    selectApiConfig: (state) =>
        state.app.config.mode === 'DEV' ? state.app.config.DEV : state.app.config.PROD,

    reducer: (state = defaultConfig, action): ISOConfig => {
        if (duck.actions.reset.isType(action))
            return action.payload

        return state
    }
}

export default configDuck

