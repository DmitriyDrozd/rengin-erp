import {call, fork, put, select} from 'typed-redux-saga'

import {getServerContext} from "./getServerContext";
import {createApp} from "../fastify/create-app"
import {broadcastSSEEventsSaga, mongoEntitiesSaga} from "@shammasov/mydux-backend";
import {defaultAdminUser, USERS} from "iso";


export function* rootSaga() {
    const ctx = yield* call(getServerContext)
    yield* mongoEntitiesSaga(ctx.orm)

    yield* fork(broadcastSSEEventsSaga)
    const state = yield* select()

    const users = yield* select(state => state.users)
    if(users.ids.length === 0) {
        yield* put(USERS.actions.added(defaultAdminUser))
    }

    const fastify = yield* call(createApp, ctx)

    const listen = async () => {
        try {
            const host = '0.0.0.0'
            const port =  37080
            console.log('SERVICE listen to ', host, port)
            await fastify.listen({host,port})
            // fastify.blipp()
            fastify.printRoutes({commonPrefix: false})
            console.info(`server listening on `, port)
        } catch (err) {
            console.error('Could not instantiate Fastify server', err)
        }
    }

    yield* call(listen)
}
