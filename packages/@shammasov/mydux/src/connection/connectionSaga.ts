import {END, eventChannel} from 'redux-saga'
import {actionChannel, call, cancel, cancelled, fork, put, select, take, takeEvery} from 'typed-redux-saga'

import * as R from 'ramda'
import ReconnectingEventSource from 'reconnecting-eventsource'
import {connectionSlice, ConnectionState, SSE_REDUX_EVENT} from './connectionSlice'
import {ActorState, EventGUID, isPersistentAction, MyDuxEvent} from '../features/dispatcher'
import {Action} from 'redux'
import {isArray} from '@shammasov/utils'
import axios from 'axios'

const defaultOptions = {
    pushCommands: async (events: Action[] | Action) => {
        const array = isArray(events) ? events : [events]
        const body = {
            events: array.map(e => ({
                ...e,
                sourceUserId: 1,
                storeGuid: 1,
            }))
        }
        const response = await axios.post('/api/push-commands', body)
        return response.data
    }
}
export function* connectionSaga(options = defaultOptions) {

    while(true) {
        const action = yield* take(connectionSlice.actions.findConnectionRequested.match)
        const state = yield* select()
        const connectionTask = yield* fork(runConnection, state.connection.findConnectionURL,options)
        yield* take(connectionSlice.actions.disconnectRequested.match)
        // user clicked stop. cancel the background task
        // this will cause the forked bgSync task to jump into its finally block
        yield* cancel(connectionTask)
    }


}



function* runConnection(route: string, options = defaultOptions) {
    const state = yield* select()
    let source = new ReconnectingEventSource(route+'?storeGuid='+state.dispatcher.storeGuid)

    try {
    const sentGuids: EventGUID[] = []
    const receivedGuids: EventGUID[] = []

        yield* takeEvery(
        connectionSlice.actions.serverPushed.match,
        function* (action) {
            if (!sentGuids.includes(action.payload.guid)) {
                const forward = {...action.payload, external: true}
                yield* put(forward)
            }
        }
    )

        const channel = eventChannel<MyDuxEvent<any, any> | ReturnType<typeof connectionSlice.actions[keyof typeof connectionSlice.actions]>>(emitter => {
              const onMessageHandler = (e: MessageEvent) => {
                console.log('SSE message', e)
                if (e.type === SSE_REDUX_EVENT)
                    emitter(JSON.parse(e.data))
            }

            const onErrorHandler = (e: Event) => {
                console.error('SSE error', e)
                emitter(connectionSlice.actions.error(JSON.stringify(e)))
                emitter(END)
            }
            const onDisconnect = (e: Event) =>{
                  console.log('onDiconnect', e)
                emitter(connectionSlice.actions.disconnected())
            }
            const onOpenHandler = (e: Event) => {
                emitter(connectionSlice.actions.connected(undefined))
            }
            source.addEventListener(SSE_REDUX_EVENT, onMessageHandler)

            source.addEventListener('error', onErrorHandler)
            source.onerror = (onErrorHandler)
            source.addEventListener('open', onOpenHandler)
            source.addEventListener("disconnect", e => {
                console.log('Disconnected', e)
                onDisconnect(e)
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

        function* readSSE() {
            while (true) {
                const action = yield* take(channel)
                if (isPersistentAction(action) && action.guid) {
                    if (receivedGuids.includes(action.guid) || sentGuids.includes(action.guid))
                        continue
                    receivedGuids.push(action.guid)
                }
                yield* put(action)
            }
        }


    function* postEventsSaga() {


        const channel = yield* actionChannel(isPersistentAction)
        while (true) {
            const action: MyDuxEvent = (yield* take(channel)) as any

            const actor:ActorState =  yield* select(state => state.dispatcher)
            const sse: ConnectionState = yield* select(state => state.sse)
            const {userId,storeGuid} = actor
            if (userId === '0' || userId === undefined)
                continue

            if (!sentGuids.includes(action.guid) &&
                !receivedGuids.includes(action.guid) && (
                    action.storeGuid === storeGuid
                )) {
                if (!action.external) {
                    sentGuids.push(action.guid)
                    // const actionToSend = R.assocPath(['info', 'storeGuid'], storeGuid, action)

                    //action.userId = action.userId || action.payload.userId || action.payload.userId
                    action.storeGuid = storeGuid
                    if (userId !== 'guest' && userId !== 'admin' && userId !== 'service' && userId && !action.userId) {
                        if (!action.userId)
                            action.userId = action.payload ? action.payload.userId : userId
                    }

                    else
                        action.userId = 'admin'


                    let sanitizedAction = R.clone(action)
                    if(isPersistentAction(action)) {

                        yield* put(connectionSlice.actions.clientPushStarted(action))
                        // console.log('sending action', action)
                        try {
                            const result = yield* call(options.pushCommands, [sanitizedAction])
                            yield* put(connectionSlice.actions.clientPushSuccess(action))
                        }
                        catch (e) {
                            yield* put(connectionSlice.actions.clientPushFailed({action,error:e}))
                        }

                    }
                    //console.log("SEND", action)-
                }

            }
        }
    }


    yield* fork(postEventsSaga)
    yield* fork(readSSE)

    } finally {
        if (yield* cancelled()) {
            if(source && source.readyState !== 2)
                source.close()
            yield* put(connectionSlice.actions.disconnected())
        }
    }
}

export default connectionSaga
