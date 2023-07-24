

export {default as connectionDuck} from './sse/sseConnectionDuck'
export {default as connectionSaga} from './sse/sseClientSaga'
import {defaultMeta, metaDuck} from './metaDuck'
import {settingsDuck,usersCrud,issuesCrud,contractsCrud,addressesCrud} from './bootstrap/index'
export const ducks  = {
    settingsDuck,
    metaDuck,
    usersCRUD: usersCrud,
    issuesCRUD: issuesCrud,
    contractsCRUD: contractsCrud,
    clientsCRUD: addressesCrud
}
export {metaDuck}

export type StoreMeta = typeof defaultMeta

