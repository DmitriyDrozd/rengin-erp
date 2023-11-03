import USERS from './users'
import BRANDS from './brands'
import LEGALS from './legals'
import SITES from './sites'
import CONTRACTS from './contracts'
import {ISSUES} from './issues'
import SUBS from './subs'
import {ItemWithId, Resource} from '../core/createResource'
import Users from "./users";

type KeyRes<R = unknown> = R extends Resource<infer RID, infer Fields> ? {
    [K in RID]: R
} : unknown
export const ResMap ={
    'USERS':USERS,
    BRANDS: BRANDS,
    LEGALS: LEGALS,
    SITES:SITES,
    SUBS:SUBS,
    CONTRACTS:CONTRACTS,
    ISSUES:ISSUES
}

export type ResVal = typeof USERS | typeof ISSUES
const  b = {} as any as ResourceByRID<'USERS'>
const i = {} as any as typeof b.exampleItem

export type ItemByRID<RID extends keyof typeof ResMap> = ItemWithId<RID, ResourceByRID<RID>['fields']>

export type ResourceByRID<RID extends keyof typeof ResMap> = RID extends keyof typeof ResMap ? typeof ResMap[RID] : never

