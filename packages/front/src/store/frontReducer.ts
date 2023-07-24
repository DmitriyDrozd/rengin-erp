import {combineReducers} from 'redux'

import {History} from 'history'
import {Bootstrap, bootstrapDuck} from "iso/src/store/bootstrapDuck";
import {uiDuck, UIState} from "./ducks/uiDuck";
import usersCrud from 'iso/src/store/bootstrap/repos/users-crud';
import {connectionDuck, metaDuck, StoreMeta} from "iso/src/store";
import {ConnectionState} from "iso/src/store/sse/sseConnectionDuck";
import frontConfigDuck, {FrontConfig} from "./ducks/frontConfigDuck";
import {routerDuck, RouterState} from "./ducks/routerDuck";
import {loadingDuck} from "./ducks/loadingDuck";
import {preferencesDuck} from "./ducks/preferencesDuck";
import {UserVO} from 'iso/src/store/bootstrap/repos/user-schema'
import {connectRouter} from '@sha/router'
export type DeepReadonly<T> = T extends any[]
    ? DeepReadonlyArray<T[number]>
    : T extends object ? DeepReadonlyObject<T> : T

export interface DeepReadonlyArray<T> extends ReadonlyArray<DeepReadonly<T>> {
}

export type DeepReadonlyObject<T> = {
    readonly [P in keyof T]: DeepReadonly<T[P]>
}

const frontReducer = (history: History ) => {
    const router = routerDuck.getReducer(history)
    const combinedReducer = combineReducers({
            router,
            app: combineReducers({
                bootstrap: bootstrapDuck.reducer,
                conn: connectionDuck.reducer,
                preferences: preferencesDuck.reducer,
            }),
            loading: loadingDuck.reducer,
            meta: metaDuck.reducer,
            ui: uiDuck.reducer,
            frontConfig: frontConfigDuck.reducer,
        },
    )
    const resultReducer = combinedReducer
    return ((state, action) => {

        const res = resultReducer(state, action)
        console.log(action.type, action, state,res)
        return res
    }) as any as typeof combinedReducer
}

type FrontReducer = ReturnType<typeof frontReducer>

export type FrontState = {
    router: RouterState,
    app: {
        bootstrap: Bootstrap,
        conn: ConnectionState
    },
    loading: string[]
    meta: StoreMeta
    ui: UIState
    frontConfig: FrontConfig
}
export const selectFrontAppState = (state: FrontState) => state


export default frontReducer


export const selectCurrentUser = (state: FrontState): UserVO => {
    const email = state.ui.login
    const user = usersCrud.selectUserByEmail(email)(state)

    return user
}
