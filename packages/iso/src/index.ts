export {default as isPersistentAction} from './isPersistentAction'

export {default as appStorage} from './appStorage'

export {default as composeWithReduxDevTools} from './store/composeWithReduxDevTools'
export {metaDuck} from './store/metaDuck'

export type {ResMap,ItemByRID,ResourceByRID} from './store/bootstrap/repos/res'

import * as DaysUtils from './utils/date-utils'

export const Days = DaysUtils
export const today = Days.today()
