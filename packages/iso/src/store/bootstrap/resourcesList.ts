import {USERS} from './repos/users'
import {BRANDS} from './repos/brands'
import {LEGALS} from './repos/legals'
import {SITES} from './repos/sites'
import {CONTRACTS} from './repos/contracts'
import {ISSUES} from './repos/issues'
import {FactoryAnyAction} from '@sha/fsa'
import {AnyFields, Resource} from './core/createResource'
import {isBrowser} from '@sha/utils'



export const RESOURCES_MAP = {
    USERS,
    BRANDS,
    LEGALS,
    SITES,
    CONTRACTS,
    ISSUES
} as const
export type ResourceNames = keyof ResourcesMap
type KeysToValues<T, Keys extends (keyof T)[]> = {
    [Index in keyof Keys]: Keys[Index] extends keyof T ? T[Keys[Index]] : never;
};

export type ResourceValues = KeysToValues<ResourcesMap, ResourceNames[]>

export const RESOURCES_LIST = [
    USERS,
    BRANDS,
    LEGALS,
    SITES,
    CONTRACTS,
    ISSUES
] as ResourceValues



export const getLinkedItem = <RID extends string, Fields extends AnyFields>(rName:  keyof typeof RESOURCES_MAP, id: string) => {
    const res = RESOURCES_MAP[rName]

}

// 👇️ type Keys = "name" | "age" | "country"
type Keys = keyof ResourcesMap;

// 👇️ type Values = string | number
export type ResourceType = (ResourcesMap)[Keys];
export type ResourcesMap = typeof RESOURCES_MAP

export const getRes = <R extends keyof typeof RESOURCES_MAP>(res: R) =>
    RESOURCES_MAP[res]

export const getResourceByAction = (action: FactoryAnyAction) => {
    return RESOURCES_LIST.find(res => res.factory.isNamespace(action))
}

if(isBrowser()) {
    window['RES'] = RESOURCES_MAP
}
