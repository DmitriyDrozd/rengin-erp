import { EXPENSES } from './index';
import { EMPLOYEES } from './repos/employees';
import {USERS} from './repos/users'
import {BRANDS} from './repos/brands'
import {LEGALS} from './repos/legals'
import {SITES} from './repos/sites'
import {CONTRACTS} from './repos/contracts'

import {SUBS} from './repos/subs'
import ISSUES from './repos/issues'
import {FactoryAnyAction} from '@sha/fsa'
import {AnyFieldsMeta, ItemWithId} from './core/createResource'
import {isBrowser} from '@sha/utils'
import {$Values} from "utility-types";


export const RESOURCES_MAP = {
    USERS,
    BRANDS,
    LEGALS,
    SITES,
    CONTRACTS,
    SUBS,
    ISSUES,
    EMPLOYEES,
    EXPENSES,
}
export type {Resource} from './core/createResource'
export type ResourcesMap = typeof RESOURCES_MAP


type KeysToValues<T, Keys extends (keyof T)[]> = {
    [Index in keyof Keys]: Keys[Index] extends keyof T ? T[Keys[Index]] : never;
};

export type UnionRes =
    typeof USERS |
    typeof BRANDS |
    typeof LEGALS |
    typeof SITES |
    typeof CONTRACTS|
    typeof ISSUES|
    typeof EMPLOYEES|
    typeof SUBS|
    typeof EXPENSES

export const RESOURCES_LIST = [
    USERS,
    BRANDS,
    LEGALS,
    SITES,
    CONTRACTS,
    SUBS,
    ISSUES,
    EMPLOYEES,
    EXPENSES,
] as const


export const getResourcesByNames = () => ({
    user:USERS,
    brand: BRANDS,
    legal: LEGALS,
    site:SITES,
    contract:CONTRACTS,
    issue:ISSUES,
    sub: SUBS,
    employee: EMPLOYEES,
    expenses: EXPENSES,
})

export const getLinkedItem = <RID extends string, Fields extends AnyFieldsMeta>(rName:  keyof typeof RESOURCES_MAP, id: string) => {
    const res = RESOURCES_MAP[rName]

}
export type ItemByRID<RID extends keyof typeof RESOURCES_MAP> = ItemWithId<RID, ResourceByRID<RID>['fields']>

export type ResourceByRID<RID extends keyof typeof RESOURCES_MAP> = RID extends keyof typeof RESOURCES_MAP ? typeof RESOURCES_MAP[RID] : never

// 👇️ type Keys = "name" | "age" | "country"
const ResourceNames =  [
    'USERS',
    'BRANDS',
    'LEGALS','SITES',
    'CONTRACTS',
    'SUBS',
    'ISSUES',
    'EMPLOYEES',
    'EXPENSES',
] as const
export type ResourceName=   typeof ResourceNames[number]

export type Res = $Values<typeof RESOURCES_LIST>

export const getRes = <R extends keyof typeof RESOURCES_MAP>(res: R): typeof RESOURCES_MAP[R]=>
    RESOURCES_MAP[res]

export const getResourceByAction = (action: FactoryAnyAction) => {
    return RESOURCES_LIST.find(res => res.factory.isNamespace(action))
}

if(isBrowser()) {
    window['RES'] = RESOURCES_MAP
}
