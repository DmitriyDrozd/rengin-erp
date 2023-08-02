import {StoreMeta} from './store/metaDuck'
import {AdminPreferences} from './store/localAdminPreferencesDuck'
import {CRR} from '@sha/router';

import {bootstrapDuck} from './store/bootstrapDuck'

type RouterState = CRR.RouterState
export type ISOState = {
    router: RouterState,
    app: {
        bootstrap: ReturnType<typeof bootstrapDuck.reducer>
    }
    meta: StoreMeta
    adminPreferences: AdminPreferences
}
