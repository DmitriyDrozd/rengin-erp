import * as FSA from './fsa'
import {FactoryAnyAction} from './fsa'
import {DeepPartial} from 'utility-types'
import {Reducer} from 'redux'

const createObjectDuck = <T>(
    factoryPrefix: string,
    defaultProps: T,
    defaultPersistent = true,
    get = (state: any): T => state.app[factoryPrefix]
) => {

    const factory = FSA.actionCreatorFactory(factoryPrefix, {persistent: defaultPersistent})
    type PatchBase = DeepPartial<T>

    const actions = {
        reset: factory<DeepPartial<T>>('reset', {persistent: false}),
        patched: factory<DeepPartial<T>>('patched', {persistent: defaultPersistent}),
        updated: factory<DeepPartial<T>>('updated', {persistent: defaultPersistent}),
    }

    const concatItemReducer = (handleItem: (state: T, action: any) => T) => {
        const result = (state: PatchBase, action) => {
            if ((action.type.startsWith(factoryPrefix))) {
                state = reducer(state, action)
            }
            return state
        }

        return Object.assign(result, {duck}) as any as Reducer<T[], FactoryAnyAction> & { duck: any }
    }


    const reducer = FSA.reducerWithInitialState(defaultProps)
        .case(
            actions.reset,
            (_, payload) => payload,
        )
        .cases(
            actions.updated,
            (state, payload) =>
                payload
        )
        .case(
            actions.patched,
            (state, payload) =>
                ({...payload, ...state})
        )
    const duck = {
        factoryPrefix,

        factory,
        actions: {...actions},
        reducer: reducer as any as (state: T[], action: FactoryAnyAction) => T[],
        concatItemReducer,
        select: state => {
            const obj: T = get ? get(state) : state
            return obj
        }


    }

    return duck
}



export default createObjectDuck
