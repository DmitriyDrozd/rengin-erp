import {createAction, createSlice, PayloadAction} from "@reduxjs/toolkit"
import {MyDuxEvent} from "../features/dispatcher";

export const SSE_REDUX_EVENT = 'SSE_REDUX_EVENT'

const initialState = {
    findConnectionURL: '/api/sse/find',
    preloaded: false,
    isConnected: false,
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
            state.findConnectionURL = action.payload
            state.isConnected = false
        },
        connected: (state, action) => {
            state.isConnected = true
            state.error = undefined
            state.pushingEvents = []
            state.failedPushes = []
            state.completedPushes = []
        },
        disconnected: (state, action) => {
            state.isConnected = false
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
          return  {...state, preloaded : true,...action.payload.sse}
      })
    },
    selectors:{
        selectSSE: (state: any) => state.sse as ConnectionState,
    }
})

const disposePreloader = () => {
    const preloader = document.getElementById('preloader')
    if(preloader && preloader.parentElement) {
        preloader.parentElement.removeChild(preloader)
        preloader.remove()
    }
}