import {END, eventChannel} from 'redux-saga'
import {actionChannel, call, fork, put, select, take, takeEvery, takeLatest} from 'typed-redux-saga'

import * as R from 'ramda'
import ReconnectingEventSource from 'reconnecting-eventsource'
import {connectionSlice, ConnectionState, SSE_REDUX_EVENT} from './connectionSlice'
import {ActorState, EventGUID, isPersistentAction, MyDuxEvent} from "../features/dispatcher";
import {Action} from "redux";
import {isArray} from "@shammasov/utils";
import axios from "axios";

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

    function* connectSSERoute(action: ReturnType<typeof connectionSlice.actions.findConnectionRequested>) {
        const route = action.payload//channel?userId=107269858252184362813&storeGuid=dasdas`// + new URLSearchParams(info).toString()

        const channel = eventChannel<MyDuxEvent<any, any> | ReturnType<typeof connectionSlice.actions[keyof typeof connectionSlice.actions]>>(emitter => {
            let source = new ReconnectingEventSource(route)
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

            const onOpenHandler = (e: Event) => {
                emitter(connectionSlice.actions.connected(undefined))
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
            if(isPersistentAction(action) && action.guid) {
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
                    if (action.userId)
                        action.userId = action.userId
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
    yield* takeLatest(connectionSlice.actions.findConnectionRequested.match, connectSSERoute)


}


export default connectionSaga
