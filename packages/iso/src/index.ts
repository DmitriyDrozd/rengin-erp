import {RESOURCES_MAP, Res} from "./store/bootstrap/resourcesList";

export {default as isPersistentAction} from './isPersistentAction'

export {default as appStorage} from './appStorage'

export {default as composeWithReduxDevTools} from './store/composeWithReduxDevTools'
export {metaDuck} from './store/metaDuck'

import * as DaysUtils from './utils/date-utils'

export const Days = DaysUtils
export const today = Days.today()

export {
    RESOURCES_MAP
}
export type {
    Res
}
