import {useSelector} from "react-redux";
import {createBrowserHistory} from "history";
import {createRouterMiddleware, createRouterReducerMapObject} from "@lagunovsky/redux-react-router";
import createSagaMiddleware from "redux-saga";
import {combineReducers, configureStore} from "@reduxjs/toolkit";
import {connectionSlice, dispatcherMiddleware, dispatcherSlice} from "@shammasov/mydux";
import {ORM, orm} from "iso";
import {uiSlice} from "../store/uiSlice";
import {Return} from "@shammasov/utils";


export type AdminContextParts = {  orm: ORM}
let adminStore: any//ReturnType<typeof buildClientStore>
export const buildAdminStore = () => {
    const history = createBrowserHistory()
    const context = {orm, history}
    const sagaMiddleware = createSagaMiddleware({context})

    const routerMiddleware = createRouterMiddleware(history)
    const rawStore = configureStore({
        reducer: combineReducers({

            ...createRouterReducerMapObject(history),
            ...orm.reducersMap,
            ui: uiSlice.reducer,
            connection: connectionSlice.reducer,
            dispatcher: dispatcherSlice.reducer,

        }),
        middleware: (getDefaultMiddleware) => getDefaultMiddleware()
            .concat(sagaMiddleware)
            .prepend(dispatcherMiddleware)
            .prepend(routerMiddleware)
        ,
        //enhancers: getDefaultEnhancers => getDefaultEnhancers().push(eventSourceEnhancer)
    })
    const run = sagaMiddleware.run


    const storeWithContext =  Object.assign(rawStore, {store: rawStore}) as any as typeof rawStore & {context: typeof context,store: typeof rawStore, run: typeof sagaMiddleware.run}
    storeWithContext.run = run
    storeWithContext.store = storeWithContext
    storeWithContext.context = context
    sagaMiddleware.setContext({context: {...context, store:rawStore}})

    return storeWithContext
}

export type AdminStore = ReturnType<typeof buildAdminStore>
type getAdminState = AdminStore['getState']

export type AdminState = Return<getAdminState>


export const useAdminState = () => useSelector(state => state as AdminState)