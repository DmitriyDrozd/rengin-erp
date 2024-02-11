import {call, fork, put, select} from 'typed-redux-saga'

import {getServerContext} from "./getServerContext";
import {createApp} from "../fastify/create-app"
import {broadcastSSEEventsSaga,mongoEntitiesSaga} from "@shammasov/mydux-backend";


export function* rootSaga() {
    const ctx = yield* call(getServerContext)
    yield* mongoEntitiesSaga(ctx.orm)

    yield* fork(broadcastSSEEventsSaga)
    const state = yield* select()
    console.log('state',state)
    const users = yield* select(state => state.users)



    const fastify = yield* call(createApp, ctx)

    const listen = async () => {
        try {
            const host = '0.0.0.0'
            const port =  35080
            console.log('SERVICE listen to ', host, port)
            await fastify.listen({host,port})
            // fastify.blipp()
            fastify.printRoutes({commonPrefix: false})
            console.info(`server listening on `, 35080)
        } catch (err) {
            console.error('Could not instantiate Fastify server', err)
        }
    }

    yield* call(listen)
    // yield* fork(syncWBSaga)
}
