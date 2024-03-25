

export {default as connectionDuck} from './sse/sseConnectionDuck'
export {default as connectionSaga} from './sse/sseClientSaga'
import {defaultMeta, metaDuck} from './metaDuck'
import {contractsCrud, ISSUES, settingsDuck, SITES, USERS, EMPLOYEES} from './bootstrap/index'

export const ducks  = {
    settingsDuck,
    metaDuck,
     USERS,
    ISSUES,
    CONTRACTS: contractsCrud,
    SITES,
    EMPLOYEES
}
export {metaDuck}

export type StoreMeta = typeof defaultMeta

