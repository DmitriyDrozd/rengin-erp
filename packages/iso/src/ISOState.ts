import {StoreMeta} from './store/metaDuck'
import {AdminPreferences} from './store/localAdminPreferencesDuck'
import {CRR} from '@sha/router';

import {bootstrapDuck} from './store/bootstrapDuck'
import type {EventVO} from 'service/src/repositories/eventStore'
import {useSelector} from "react-redux";

type RouterState = CRR.RouterState
export type ISOState = {
    router: RouterState,
    app: {
        bootstrap: ReturnType<typeof bootstrapDuck.reducer>,
        events: EventVO[]
        focus: string | number | undefined
    }
    meta: StoreMeta
    adminPreferences: AdminPreferences
}


export const useISOState = () => useSelector((state: any) => state as ISOState)