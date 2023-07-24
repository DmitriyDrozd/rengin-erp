import {actionChannel, call, fork, take, takeEvery} from "typed-redux-saga";
import {ActionMatchingPattern, ActionPattern} from "@redux-sagas/types";
import {SSE_REDUX_EVENT} from "iso/src/store/sse/sseConnectionDuck";
import {filterNotStoreGuid, SSESessionState} from "./createSSESession";
import {FactoryAnyAction} from "@sha/fsa";

import getSSEAllSesionsChannel from "./getSSEAllSesionsChannel";

import {Session} from "@sha/better-sse";
import {isPersistentAction} from "iso";
import {sessionsDuck} from "./sessionsDuck";
import isPublicForAllAction from "./isPublicForAllAction";


export default function* broadcastSSEEventsSaga() {


    const allSessions: Session<SSESessionState>[] = []
    getSSEAllSesionsChannel().addListener('session-registered', (session) => allSessions.push(session))

    getSSEAllSesionsChannel().addListener('session-deregistered', (session: Session<SSESessionState>) => {
        const index = allSessions.findIndex(s => s.state.storeGuid === session.state.storeGuid);
        if (index > -1) {
            allSessions.splice(index, 1);
        }
    })
    yield* takeEvery(act => {

        try {
            const result = sessionsDuck.actions.broadcast.isType(act)
            return result
        } catch (e) {
            console.error('BroadcastSSEEventsSagaError takeEvery ', act)
            console.error(e)
        }
        return false
    }, function* (action: ReturnType<typeof sessionsDuck.actions.broadcast>) {
        const {event, sessions} = action.payload
        if (action.payload.sessions === 'all') {
            getSSEAllSesionsChannel().broadcast(action.payload.event, SSE_REDUX_EVENT, {
                filter: (session: Session<SSESessionState>) => sessions.includes(session.state.storeGuid)
            })
        } else {
            getSSEAllSesionsChannel().broadcast(action.payload.event, SSE_REDUX_EVENT, {
                filter: (session: Session<SSESessionState>) => sessions.includes(session.state.storeGuid)
            })
        }
    })
    yield* actionChannelWorker(act => {

        try {
            const result = isPersistentAction(act)  || isPublicForAllAction(act)
            return result
        } catch (e) {
            console.error('actionChannelWorker isPersistentAction test ', act)
            console.error(e)
        }
        return false
    }, async (action: FactoryAnyAction) => {
        const sourceStoreGuid = action.storeGuid
        //console.log('BroadcastSSE: ', 'found persistent action', action)
        //console.log('\t', 'by store ', sourceStoreGuid)

        const args = [SSE_REDUX_EVENT, action, {filter: filterNotStoreGuid(sourceStoreGuid)}] as const
        const channel = getSSEAllSesionsChannel()// getSSEAdminChannel('admin')
        //.forEach( channel => {
        //console.log('\t', 'to admins')
        //console.log('\t\t', 'active admin length', channel.activeSessions.length)
        //console.log('\t\t', 'send to SSE client with storeGuids:')
        //console.log('\t\t\t', channel.activeSessions.filter(filterNotStoreGuid(sourceStoreGuid)).map(s => s.state.storeGuid).join(','))

        channel.broadcast(action, SSE_REDUX_EVENT, {filter: filterNotStoreGuid(sourceStoreGuid)})
        //})

        /*  const userId = action.userId || action.meta.userId || (action.payload && action.payload.userId)
          if(userId) {
              const channel = getSSEUserChannel(userId)
              channel.activeSessions
              //console.log('\t', 'to user', userId)
              //console.log('\t\t', 'active sessions length', channel.activeSessions.length)
              //console.log('\t\t', 'send to SSE client with storeGuids:')
              //console.log('\t\t\t', channel.activeSessions.filter(filterNotStoreGuid(sourceStoreGuid)).map(s => s.state.storeGuid).join(','))
              channel.broadcast(SSE_REDUX_EVENT, action, {filter: filterNotStoreGuid(sourceStoreGuid)})
          }*/
    })

}

const isGeneratorFunction = (fn: Function) => ['GeneratorFunction', 'AsyncGeneratorFunction'].includes(fn.constructor.name)

function* actionChannelWorker<P extends ActionPattern>(
    pattern: P,
    worker: (action: ActionMatchingPattern<P>) => any,
) {
    const channel = yield* actionChannel(pattern)

    function* sequentialWorker() {
        while (true) {
            const action = yield* take(channel)
            try {

                if (isGeneratorFunction(worker)) {
                    yield* worker(action)
                } else {
                    yield* call(worker, action)
                }
            } catch (e) {
                console.error('sequientalWorkerSaga error', e)
                console.error('take action', action)
            }
        }
    }

    return yield* fork(sequentialWorker)
}
