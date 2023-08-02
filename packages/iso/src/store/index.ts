

export {default as connectionDuck} from './sse/sseConnectionDuck'
export {default as connectionSaga} from './sse/sseClientSaga'
import {defaultMeta, metaDuck} from './metaDuck'
import {contractsCrud, issuesCrud, settingsDuck, units, users} from './bootstrap/index'

export const ducks  = {
    settingsDuck,
    metaDuck,
    usersCRUD: users,
    issuesCRUD: issuesCrud,
    contractsCRUD: contractsCrud,
    clientsCRUD: units
}
export {metaDuck}

export type StoreMeta = typeof defaultMeta

