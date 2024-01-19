import {all, call, fork, put, select, setContext, take} from 'typed-redux-saga'

import {SagaOptions} from '../sagaOptions'
import startServer from './startServer';
import {bootstrapCruds} from 'iso/src/store/bootstrapDuck';
import {defaultAdminUser, usersResource} from 'iso/src/store/bootstrap/repos/users'
import {bootstrapRepositories} from "../repositories/bootstrapRepositories";
import {config} from "@app-config/main";

var current = global.performance.now()
const timeLog = (title: string, ...args?: any[]) => {
    const now = global.performance.now()
    console.log(title, now-current, ...args)
    current = now
}
export function* serverSaga(io: SagaOptions) {

    timeLog('start service saga')
    yield* setContext({io})
    yield* fork(bootstrapRepositories, io)
    timeLog('Repositories bootstraped')
    const effects = yield* all(
        bootstrapCruds.map(crud => take(crud.actions.reset.isType))
    )
    timeLog('cruds reset')
    const users = yield* select(usersResource.selectAll)
    if(users.length === 0) {
        yield* put(usersResource.actions.added(defaultAdminUser))
    }




    const fastify = yield* call(startServer, io)
timeLog('fastify startServer completed')
    yield* setContext({fastify})
    io.fastify = fastify

    const listen = async () => {
        try {

            const host = '0.0.0.0'
            console.log('SERVICE listen to ', host, config.PORT)
            await fastify.listen(config.PORT, '0.0.0.0')
            // fastify.blipp()
            fastify.printRoutes({commonPrefix: false})
            console.info(`server listening on `, config.PORT)
        } catch (err) {
            console.error('Could not instantiate Fastify server', err)
        }
    }

    yield* call(listen)
    timeLog('LISTEN')
    // yield* fork(syncWBSaga)
}
