import * as fsa from '@sha/fsa'
import {FactoryAnyAction} from '@sha/fsa'

export const SSE_REDUX_EVENT = 'SSE_REDUX_EVENT'

const factory = fsa.actionCreatorFactory('sseClientConnection')

const actions = {
    factory,
    connected: factory<undefined>('CONNECTED'),
    disconnected: factory<undefined>('DISCONNECTED'),
    error: factory<string>('ERROR'),
    failed: factory<string>('FAILED'),
    gatewayChanged: factory<string>('GATEWAY_CHANGED'),
    fetchStateRequested: factory<string>('FETCH_STATE_REQUESTED'),
    fetchStateSuccessed: factory<any>('FETCH_STATE_SUCCESSED'),
    fetchStateFailed: factory<string>('FETCH_STATE_FAILED'),
    serverPushed: factory<FactoryAnyAction>('SERVER_PUSHED'),
    clientPushStarted: factory<FactoryAnyAction>('CLIENT_PUSH_STARTED'),
    clientPushSuccess: factory<FactoryAnyAction>('CLIENT_PUSH_SUCCESS'),
    clientPushFailed: factory<{action: FactoryAnyAction, error: any}>('CLIENT_PUSH_FAILED')
}



/**
 * Describes the connection information
 */
export interface ConnectionState {
    isConnected?: boolean
    gateway?: string
    error?: string
    doReconnect?: boolean

    /**
     * is credentials connected to master ?
     */
    isMaster?: boolean

    pushingEvents: FactoryAnyAction[]
    completedPushes: FactoryAnyAction[]
    failedPushes: FactoryAnyAction[]
}


const defaultConnectionState: ConnectionState ={
    pushingEvents:[],
    completedPushes:[],
    failedPushes:[],
    isConnected: false}
const reducer = (state: ConnectionState = defaultConnectionState, action: fsa.FactoryAnyAction): ConnectionState => {
    if (actions.clientPushStarted.isType(action))
        return {
            ...state,
            pushingEvents: [action.payload, ...state.pushingEvents]
        }
    if (actions.clientPushFailed.isType(action))
        return {
        ...state,
            pushingEvents: state.pushingEvents.filter(a => action.payload.guid !== a.guid),
            failedPushes: [action, ...state.failedPushes],
        }
    if (actions.clientPushSuccess.isType(action))
        return {
            ...state,
            pushingEvents: state.pushingEvents.filter(a => action.payload.guid !== a.guid),
            completedPushes: [action, ...state.completedPushes],
        }
    if (actions.connected.isType(action))
        return {...state, isConnected: true, error: undefined}

    else if (actions.disconnected.isType(action))
        return {...state, isConnected: false}

    else if (actions.error.isType(action))
        return {...state, error: action.payload, isConnected: false}

    else if (actions.gatewayChanged.isType(action))
        return {...state, gateway: action.payload, error: undefined, isConnected: false}

    return state
}

const select = (state: { app: { conn: ConnectionState } }) => state.app.conn

const sseConnectionDuck = {
    reducer,
    actions,
    factory,
    select,
}

export default sseConnectionDuck
