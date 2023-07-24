import {createCRUDDuck} from '@sha/fsa'
import {Action} from "redux";

export type SessionVO = {
    sessionId?: string
    userId?: string
    email?: string
    ip?: string
    createdAt?: string
    updatedAt?: string
    connectionHeaders?: any
}
const duck = createCRUDDuck('sessions', 'sessionId', {} as any as SessionVO, false)


const actions = {
    ...duck.actions,
    broadcast: duck.factory<{ event: Action, sessions: string[] | 'all' }>('broadcast'),
}

export const sessionsDuck = {
    ...duck,
    actions
}
