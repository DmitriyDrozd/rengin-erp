import * as fsa from '@sha/fsa'
import * as random from '@sha/random'

const factory = fsa.actionCreatorFactory('meta')
export const defaultMeta = {
    storeGuid: random.generateGuid(),
    userId: 'service'
}

export type StoreMeta = typeof defaultMeta

const actions = {
    metaUpdated: factory<Partial<StoreMeta>>('metaUpdated'),
    eventHandled: factory<{ guid: string, result?: any, error?: any }>('eventHandled'),
}


const reducer = (state = defaultMeta, action: fsa.FactoryAnyAction) => {
    if (actions.metaUpdated.isType(action))
        return {...state, ...action.payload}
    return state
}

export const metaDuck = {
    reducer,
    actions,
    factory,
    selectMeta: (state: { meta: StoreMeta }) => state.meta
}
