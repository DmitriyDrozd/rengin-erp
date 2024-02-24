import {createAction, createSlice, PayloadAction} from '@reduxjs/toolkit'
import {MyDuxEvent} from '../features/dispatcher'

export const SSE_REDUX_EVENT = 'SSE_REDUX_EVENT'
export enum SSEReadyStatesEnum { 
    CONNECTING, 
    OPEN,
    CLOSED,
    INITIALIZING = -1
}
const initialState = {
    findConnectionURL: '/api/sse/find',
    bootstraped: false,
    isConnected: false,
    sseReadyState: SSEReadyStatesEnum.INITIALIZING as any as SSEReadyStatesEnum,
    error: undefined as any,
    pushingEvents: [] as PayloadAction<MyDuxEvent<any, any>>[],
    completedPushes: [] as PayloadAction<MyDuxEvent>[],
    failedPushes: [] as   PayloadAction<{action:MyDuxEvent, error: any}>[]
}


export type ConnectionState = typeof initialState & Partial<Creds>


export const bootstrapAction = createAction<any>('bootstrap')

export type Creds = {password: string, email: string}
export const connectionSlice = createSlice({
    name:'connection',
    initialState: initialState as ConnectionState ,
    reducers: {
        findConnectionRequested: (state, action: PayloadAction<string>)=>{
            return {
                ...initialState,
                sseReadyState: SSEReadyStatesEnum.CONNECTING,
                findConnectionURL: action.payload || '/api/sse/find'
            }
        },
        disconnectRequested: (state, action:PayloadAction<void>) => {

        },
        connected: (state, action) => {
            state.isConnected = true
            state.sseReadyState = SSEReadyStatesEnum.OPEN
        },
        disconnected: (state, action: PayloadAction<void>) => {
            state.isConnected = false
            state.sseReadyState = SSEReadyStatesEnum.CLOSED
        },
        serverPushed: (state, action: PayloadAction<MyDuxEvent>) => {
            return state
        },
        error: (state,action: PayloadAction<any>) => {
            state.error = action.payload
            
        },
        clientPushStarted:(state, action: PayloadAction<MyDuxEvent>) => {
            state.pushingEvents.push(action)
        },
        clientPushFailed:(state, action: PayloadAction<{action: MyDuxEvent, error: any}>) => {
            state.failedPushes.push(action)
        },
        clientPushSuccess:(state, action: PayloadAction<MyDuxEvent>) => {
            state.completedPushes.push(action)
        },
    },
    extraReducers: builder => {
      builder.addCase(bootstrapAction, (state, action) =>{
          disposePreloader()
          return  {...state, bootstraped : true,...action.payload.sse}
      })
    },
    selectors:{
        selectConnection: (state: any) => state.connection as ConnectionState,
    }
})

export const disposePreloader = () => {
    const preloader = document.getElementById('preloader')
    if(preloader && preloader.parentElement) {
        preloader.parentElement.removeChild(preloader)
        preloader.remove()
    }
}