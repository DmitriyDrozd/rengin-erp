import {END, eventChannel} from 'redux-saga'
import {actionChannel, call, fork, put, select, take, takeEvery, takeLatest} from 'typed-redux-saga'
import conn from './sseConnectionDuck'
import sseConnectionDuck, {SSE_REDUX_EVENT} from './sseConnectionDuck'
import * as R from 'ramda'
import ReconnectingEventSource from 'reconnecting-eventsource'
import {isPersistentAction, metaDuck} from '../../index'
import {USERS} from '../bootstrap/repos/users'
import {FactoryAnyAction, isNamespace} from '@sha/fsa'
import getRestApi from '../../getRestApi';
import {StoreMeta} from '../metaDuck';

const sentGuids = []

export function* sseClientSaga() {


    yield* takeEvery(
        conn.actions.serverPushed.isType,
        function* (action: typeof conn.actions.serverPushed.example) {
            if (!sentGuids.includes(action.payload.guid)) {
                const forward = {...action.payload, external: true}
                //console.log(forward)
                yield* put(forward)
            }
        }
    )


    function* readSSERoute(route) {
        const channel = eventChannel(emitter => {
            let source = new ReconnectingEventSource(route)


            const onMessageHandler = (e: MessageEvent) => {
                console.log('SSE message', e)

                if (e.type === SSE_REDUX_EVENT)
                    emitter(JSON.parse(e.data))
            }

            const onErrorHandler = (e: Event) => {
                console.error('SSE error', e)
                emitter(sseConnectionDuck.actions.error(JSON.stringify(e)))
                emitter(END)
            }

            const onOpenHandler = (e: Event) => {
                emitter(sseConnectionDuck.actions.connected(undefined))
            }
            source.addEventListener(SSE_REDUX_EVENT, onMessageHandler)

            source.addEventListener('error', onErrorHandler)

            source.addEventListener('open', onOpenHandler)
            source.addEventListener("disconnect", e => {
                console.log('Disconnected', e)
            });
            /* const interval = setInterval(() => {
               console.log('readyState', source.readyState)
             },
                 100)*/
            // The subscriber must return an unsubscribe function
            return () => {
                if (source) {
                    source.close()
                    //    clearInterval(interval)
                }
            }
        })

        while (true) {
            const action = yield* take(channel)
            if (window['store'].appliedGuids.includes(action.guid))
                continue
            window['store'].appliedGuids.push(action.guid)
            yield* put(action)
        }
    }

    function* readWorker() {
        yield* takeLatest(metaDuck.actions.metaUpdated.isType, function* (action) {
            if (action.payload.userId === 'admin') {
                yield* readSSERoute('/api/sse/admin?' + new URLSearchParams(action.payload).toString())
            } else if (action.payload.userId !== 'guest') {

                yield* readSSERoute('/api/sse/user?' + new URLSearchParams(action.payload).toString())
            }
        })
    }


    function* postEventsSaga() {
        const endpoint = yield* call(getRestApi)

        const channel = yield* actionChannel(isPersistentAction)
        while (true) {
            const action: FactoryAnyAction = (yield* take(channel)) as any
            const meta: StoreMeta = yield* select(state => state.meta)
            const url = yield* select(state => state.app.conn.gateway)
            const params = new URLSearchParams(url)
            const storeGuid = params.get('storeGuid')
            const userId = params.get('userId') || 'guest'
            if (userId === '0')
                continue

            if (!sentGuids.includes(action.guid) && (action.storeGuid === undefined || action.storeGuid === meta.storeGuid)) {
                if (!action.external) {
                    sentGuids.push(action.guid)
                    // const actionToSend = R.assocPath(['meta', 'storeGuid'], storeGuid, action)

                    //action.userId = action.userId || action.payload.userId || action.payload.userId
                    action.storeGuid = storeGuid
                    if (meta.userId !== 'guest' && meta.userId !== 'admin' && meta.userId !== 'service' && meta.userId && !action.userId) {
                        if (!action.userId)
                            action.userId = action.payload ? action.payload.userId : meta.userId
                    }
                    if (action.userId)
                        action.userId = action.userId
                    else
                        action.userId = 'admin'


                    let sanitizedAction = R.clone(action)
                    if ((meta.userId && isNamespace(USERS.factory)(action)) || isPersistentAction(action)) {


                        yield* put(sseConnectionDuck.actions.clientPushStarted(action))
                        // console.log('sending action', action)
                        try {
                            const result = yield* call(endpoint.pushCommands, [sanitizedAction])
                            yield* put(sseConnectionDuck.actions.clientPushSuccess(action))
                        }
                        catch (e) {
                            yield* put(sseConnectionDuck.actions.clientPushFailed({action,error:e}))
                        }

                    }
                    //console.log("SEND", action)
                }

            }
        }
    }

    yield* fork(readWorker)
    yield* fork(postEventsSaga)
}


export default sseClientSaga
