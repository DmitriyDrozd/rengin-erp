import createSagaMiddleware from 'redux-saga'
import {configureStore} from "@reduxjs/toolkit"
import {dispatcherMiddleware, dispatcherSlice} from "@shammasov/mydux"

import {Connection} from "mongoose";
import {GServices} from "../fastify/gapis-token/getGServices";

import knex from "knex";
import {createEventStoreMiddleware} from "@shammasov/mydux-backend"
import {ORM} from "@rengin/iso";

export type ServerContextParts = { mongo: Connection, gServices: GServices, orm: ORM, pg: ReturnType<typeof knex> }
const configureBackendStore = async ({orm,gServices, mongo, pg}:ServerContextParts) =>{
    const context = {mongo,orm,gServices,pg}
    const sagaMiddleware = createSagaMiddleware<{context: typeof context}>({context: context})
    const rawStore = configureStore({
        reducer: {
            dispatcher: dispatcherSlice.reducer,

            ...orm.reducersMap,

        },
        middleware:  getDef => getDef()
            .concat(sagaMiddleware)
            .prepend(dispatcherMiddleware)
            .prepend(createEventStoreMiddleware(mongo)),
      //  enhancers: getDef => getDef().concat(devToolsEnhancer({port: 8000,hostname: 'localhost',name:'godj:server'}))

    })
    const run = sagaMiddleware.run


    const storeWithContext =  Object.assign(rawStore, {store: rawStore}) as any as typeof rawStore & {context: ServerContextParts,store: typeof rawStore, run: typeof sagaMiddleware.run}
    storeWithContext.run = run
    storeWithContext.store = storeWithContext
    storeWithContext.context = context
    sagaMiddleware.setContext({context: {...context, store:rawStore}})

    return storeWithContext

}

export type ServerState = ReturnType<ServerStore['getState']>
export type ServerStore =
    Awaited<ReturnType<typeof configureBackendStore>>

export type ServerContext = ServerContextParts & {store: ServerStore}


export default configureBackendStore

