import {USERS} from './repos/users'
import {BRANDS} from './repos/brands'
import {LEGALS} from './repos/legals'
import {SITES} from './repos/sites'
import {CONTRACTS} from './repos/contracts'
import {ISSUES} from './repos/issues'
import {SUBS} from './repos/subs'

import {FactoryAnyAction} from '@sha/fsa'
import {AnyFieldsMeta, Resource} from './core/createResource'
import {isBrowser} from '@sha/utils'






export const RESOURCES_MAP = {
    USERS,
    BRANDS,
    LEGALS,
    SITES,
    CONTRACTS,
    ISSUES,
    SUBS,
}
export type ResourcesMap = typeof RESOURCES_MAP


type KeysToValues<T, Keys extends (keyof T)[]> = {
    [Index in keyof Keys]: Keys[Index] extends keyof T ? T[Keys[Index]] : never;
};


export const RESOURCES_LIST = [
    USERS,
    BRANDS,
    LEGALS,
    SITES,
    CONTRACTS,
    ISSUES,
    SUBS,
] as const

export type ResourceName =typeof RESOURCES_LIST[number]['resourceName']


export const getResourcesByNames = () => ({
    user:USERS,
    brand: BRANDS,
    legal: LEGALS,
    site:SITES,
    contract:CONTRACTS,
    issue:ISSUES,
    sub: SUBS,
})

export type BrandsResource = typeof BRANDS

const a: ResourceName ='legals'
export const getLinkedItem = <RID extends string, Fields extends AnyFieldsMeta>(rName:  keyof typeof RESOURCES_MAP, id: string) => {
    const res = RESOURCES_MAP[rName]

}

// 👇️ type Keys = "name" | "age" | "country"



export const getRes = <R extends keyof typeof RESOURCES_MAP>(res: R): typeof RESOURCES_MAP[R]=>
    RESOURCES_MAP[res]

export const getResourceByAction = (action: FactoryAnyAction) => {
    return RESOURCES_LIST.find(res => res.factory.isNamespace(action))
}

if(isBrowser()) {
    window['RES'] = RESOURCES_MAP
}
