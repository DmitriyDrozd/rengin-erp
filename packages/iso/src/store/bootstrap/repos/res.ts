import USERS from './users'
import BRANDS from './brands'
import LEGALS from './legals'
import SITES from './sites'
import CONTRACTS from './contracts'
import ISSUES from './issues'
import SUBS from './subs'
import {AnyFieldsMeta, ItemWithId, Resource} from '../core/createResource'
import {RESOURCES_LIST} from '../resourcesList'

type KeyRes<R = unknown> = R extends Resource<infer RID, infer Fields> ? {
    [K in RID]: R
} : unknown
export type ResMap =
    KeyRes<typeof USERS> &
    KeyRes<typeof BRANDS> &
    KeyRes<typeof LEGALS> &
KeyRes<typeof SITES> &
KeyRes<typeof CONTRACTS> &
KeyRes<typeof ISSUES> &
KeyRes<typeof SUBS>
type ResMapKey = keyof ResMap
const k: ResMapKey = 'brand'
type A = ItemByRID<'issue'>

export type ItemByRID<RID extends keyof ResMap> = ItemWithId<RID, ResourceByRID<RID>['fields']>

export type ResourceByRID<RID extends keyof ResMap> = RID extends keyof ResMap ? ResMap[RID] : never

