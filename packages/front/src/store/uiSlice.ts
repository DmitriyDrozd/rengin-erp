import {createSlice} from "@reduxjs/toolkit";

export const uiSlice = createSlice({
    name: 'ui',
    initialState: {
        busy: false
    },
    reducers: {
        busy: (state) => {
            state.busy = true
        },
        unbusy: (state) => {
            state.busy = false
        },
    }
})

export type UIState = ReturnType<typeof uiSlice.reducer>