import {applyMiddleware, compose, createStore} from 'redux'
import createSagaMiddleware from 'redux-saga'
import {generateEventGuid, isBrowser} from '@shammasov/utils'
import frontReducer, {FrontState, selectCurrentUser} from './frontReducer'

import {getBrowserHistory, routerMiddleware} from '@sha/router'
import {composeWithReduxDevTools} from 'iso';

export const appliedGuids:string[] = []

const REDUX_DEV_TOOLS = '__REDUX_DEVTOOLS_EXTENSION__'

const configureAdminStore = (
    initialState?: FrontState,
    historyInstance: ReturnType<typeof getBrowserHistory> = getBrowserHistory()
) => {

    // @ts-ignore
    const store = createStore(frontReducer(historyInstance), initialState, getFrontEndMiddleware(historyInstance))
    store.appliedGuids = appliedGuids
    store['runSaga'] = sagaMiddleware.run
    const dispatch = store.dispatch
    let prevRoute = '?'

    // @ts-ignore
    store['dispatch'] = (action: FactoryAnyAction) => {
        if(action === undefined)
            debugger
        const user = selectCurrentUser(store.getState())
        const state: FrontState = store.getState()
        const userId = user ? user.userId : undefined
        if (!action) return
        if (userId && action.meta && action.meta.persistent && !action.userId) {
            action = {...action, userId, meta: {...action.meta, userId}}
            /*
           if( action && action.meta) {
               action.meta.persistent = false
           }
           */
            action = {...action}
            if (!action.guid)
                action.guid = generateEventGuid()
            if (!action.storeGuid) {
                action.storeGuid = state.meta.storeGuid
            }
            if (!action.timestamp)
                action.timestamp = new Date().toISOString()

            if (!appliedGuids.includes(action.guid)) {
                if (action.payload && action.payload.userId) {
                    action.userId = action.payload.userId
                }


                appliedGuids.push(action.guid)
            } else {
                return;
            }
        }
        try {
            if (action && action.type === '@printman/router/LOCATION_CHANGE') {
                if (prevRoute !== action.payload.location.pathname) {
                    prevRoute = action.payload.location.pathname
                    dispatch(action)
                }
            } else {
                dispatch(action)
            }
        } catch (e) {
            console.error(e)
        }
    }
    singletonFrontendStore = store
    return store as typeof store & { runSaga: Function, history: any }
}

export let singletonFrontendStore

const sagaMiddleware = createSagaMiddleware()

const getFrontEndMiddleware = (history: any) =>
    isBrowser() && window[REDUX_DEV_TOOLS]
        ?
        composeWithReduxDevTools('RENGIN')(
            applyMiddleware(routerMiddleware(history), sagaMiddleware)//, logRocketMiddleware),
        )
        :
        compose(
            applyMiddleware(routerMiddleware(history), sagaMiddleware)// logRocketMiddleware),
        )


export default configureAdminStore
