import * as fsa from '@sha/fsa'
import {FactoryAnyAction} from '@sha/fsa'
import {prepend, tail} from 'ramda'

import {connectRouter} from "@sha/router"
import {History} from 'history'
import * as RR from '@sha/router'
import type {LocationChangeAction, RouterActionType, RouterLocation} from 'connected-react-router'
import {put, select, takeEvery} from 'typed-redux-saga'

const factory = fsa.actionCreatorFactory('router')

const actions = {
    backOrReplacePage: factory<string>('backOrReplace'),
    pushPage: factory<{ url: string, state?: any }>('pushPage'),
    replacePage: factory<{ url: string, state?: any }>('replacePage')
}

export function* routerSaga(history: History) {

    yield* takeEvery(actions.backOrReplacePage.isType, function* backOrReplaceWorker(action) {
        const routerState = yield* select(selectRouter)

        if (routerState.history.length > 1) {
            yield* put(RR.CRR.goBack())
        } else {
            yield* put(RR.replace(action.payload))
        }
    })
    yield* takeEvery(actions.pushPage.isType, function* pushPageWorker(action) {
        yield* put(RR.push(action.payload.url, action.payload.state))
    })
    yield* takeEvery(actions.replacePage.isType, function* replacePageWorker(action) {
        yield* put(RR.replace(action.payload.url, action.payload.state))
    })
}

export const selectRouter = (state: FrontState) => {
    return state.router
}

export type RouterState = {
    history: RouterLocation<any>[]
    location: RouterLocation<any>,
    action: RouterActionType,
}

const getReducer = (history) => {
    const mainReducer = connectRouter(history)

    const historyReducer = (state: RouterLocation<any>[] = [], action: FactoryAnyAction) => {
        if (action.type === RR.LOCATION_CHANGE) {
            const act = action as any as LocationChangeAction
            if (act.payload.isFirstRendering) {
                return [act.payload.location]
            } else if (act.payload.action === 'POP') {
                return tail(state)
            } else if (act.payload.action === 'PUSH') {
                return prepend(act.payload.location, state)
            }
            return [act.payload.location, ...tail(state)]
        }
        return state
    }
    const initialState = {history: [], ...mainReducer()}
    const reducer = (state: RouterState = initialState, action) => {
        if (action.type === RR.CRR.LOCATION_CHANGE) {

            const newState = {
                ...mainReducer(state, action),
                history: historyReducer(state.history, action),
            }

            return newState
        }
        if (action.type === RR.CRR.CALL_HISTORY_METHOD) {

            const newState = {
                ...mainReducer(state, action),
                history: historyReducer(state.history, action),
            }

            return newState
        }
        return state
    }

    return reducer

}

export const routerDuck = {
    actions,
    getReducer,
    selectRouter,
}
