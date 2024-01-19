import {combineReducers} from 'redux'

import {History} from 'history'
import {Bootstrap, bootstrapDuck} from 'iso/src/store/bootstrapDuck';
import {uiDuck, UIState} from './ducks/uiDuck';
import {default as USERS, UserVO} from 'iso/src/store/bootstrap/repos/users';
import {connectionDuck, metaDuck, StoreMeta} from 'iso/src/store';
import {ConnectionState} from 'iso/src/store/sse/sseConnectionDuck';
import frontConfigDuck, {FrontConfig} from './ducks/frontConfigDuck';
import {routerDuck, RouterState} from './ducks/routerDuck';
import {loadingDuck} from './ducks/loadingDuck';
import {Preferences, preferencesDuck} from './ducks/preferencesDuck';
import {IssueVO} from "iso/src/store/bootstrap/repos/issues";

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
    return ((state: any, action: any) => {

        const res = resultReducer(state, action)
        return res
    }) as any as typeof combinedReducer
}

type FrontReducer = ReturnType<typeof frontReducer>

export type FrontState = {
    router: RouterState,
    app: {
        bootstrap: Bootstrap,
        conn: ConnectionState
        currentIssue: IssueVO
        preferences: Preferences
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
    const user = USERS.selectUserByEmail(email as any as string)(state)

    return user as any as UserVO
}
