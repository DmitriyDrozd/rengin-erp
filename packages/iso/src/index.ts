import {Res, RESOURCES_MAP} from "./store/bootstrap/resourcesList";
import * as DaysUtils from './utils/date-utils'

export {default as isPersistentAction} from './isPersistentAction'

export {default as appStorage} from './appStorage'

export {default as composeWithReduxDevTools} from './store/composeWithReduxDevTools'
export {metaDuck} from './store/metaDuck'

export type {Resource } from './store/bootstrap/core/createResource'

export const Days = DaysUtils
export const today = Days.today()

export {
    RESOURCES_MAP
}
export type {
    Res
}
