import {createSlice, current, isAnyOf, PayloadAction} from "@reduxjs/toolkit";
import {generateGuid} from "@shammasov/utils";
import {bootstrapAction} from "../../connection";

const defaultDispatcherState={
    storeGuid: generateGuid(),
    userId: undefined as any as string,
    environment: process.env.NODE_ENV,
}

export type ActorState = typeof defaultDispatcherState
export const dispatcherSlice = createSlice({
    name: 'dispatcher',
    initialState:defaultDispatcherState,
    reducers: {
        dispatcherChanged: (state, action: PayloadAction<ActorState>) => {
           return  {...current(state, ),...action.payload}
        }
    },
    extraReducers: builder => {
        builder.addCase(bootstrapAction, (state, action) =>{
            return  {...current(state, ),...action.payload.dispatcher}
        })
    },
})


export const isDispatcherChangedAction = isAnyOf(dispatcherSlice.actions.dispatcherChanged,bootstrapAction)