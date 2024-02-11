import {PayloadAction} from "@reduxjs/toolkit";

export const isPersistentAction = (action: unknown): action is MyDuxEvent<any, string> => {
    // @ts-ignore
    const result = Boolean(action && action.meta && (action.meta.persistent === true))
    return result
}

export type MyDuxTopMeta = {
    userId: string | undefined
    storeGuid: string
    timestamp: string
    guid: EventGUID
    external?: boolean
    createdAt?: any
}
export type MyDuxMeta =MyDuxTopMeta & {

    persistent?: boolean
    replay?: boolean
    isPublicForAll?: boolean
    external?: boolean
    noRepo?:boolean

}

export type EventGUID = string

export type MyDuxEvent<P = any, T extends string = string> = PayloadAction<P, T, MyDuxMeta> & MyDuxTopMeta