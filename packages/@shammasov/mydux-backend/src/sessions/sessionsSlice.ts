import {createSlice, PayloadAction, UnknownAction} from "@reduxjs/toolkit";

export type SessionVO = {
    sessionId: string
    userId?: string
    email?: string
    ip?: string
    createdAt?: string
    updatedAt?: string
    connectionHeaders?: any
}

export const sessionsSlice = createSlice({
            name: "sessions",
            initialState: {} as any as Record<string, SessionVO>,
            reducers:{
                broadcast: (state, action: PayloadAction<{ event: UnknownAction, sessions: string[] | 'all' }>) => {

                },
                added: (state, action:PayloadAction<SessionVO>) => {
                    state[action.payload.sessionId] = action.payload
                },
                removed: (state, action:PayloadAction<string>) => {
                    delete state[action.payload]
                },
        }})
