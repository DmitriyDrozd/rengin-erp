import {actionCreatorFactory} from '@shammasov/mydux';
import {equals, prepend, reject} from 'ramda';
import {FrontState} from '../frontReducer';

const factory = actionCreatorFactory('loading')

const actions = {
    show: factory<string>('show'),

    hide: factory<string>('hide'),

    clear: factory<undefined>('clear'),
}

const defaultState = [] as string []


const reducer = (state = defaultState, action) => {
    if (actions.clear.isType(action))
        return []
    if (actions.show.isType(action))
        return prepend(action.payload, state)
    if (actions.hide.isType(action))
        return reject(equals(action.payload), state)
    return state
}
export const selectLoadingText = (state: FrontState) => {
    return state.loading[0];
}
export const loadingDuck = {
    factory,
    reducer,
    actions,

}
