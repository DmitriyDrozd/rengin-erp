
import {StoreMeta} from './store/metaDuck'
import {AdminPreferences} from './store/localAdminPreferencesDuck'

import {Settings} from "./store/bootstrap/settingsDuck";
import {CRR} from "@sha/router";
import {UserVO} from "./store/bootstrap/repos/users-crud";
import {AddressVO} from './store/bootstrap/repos/addresses-schema'
import {ContractVO} from './store/bootstrap/repos/contracts-schema'
import {IssueVO} from './store/bootstrap/repos/Issues-schema'

type RouterState = CRR.RouterState
export type ISOState = {
    router: RouterState,
    app: {
        bootstrap: {
            users: UserVO[]
            addresses: AddressVO[]
            contracts: ContractVO[]
            issues: IssueVO[]
            settings: Settings
        }
    }
    meta: StoreMeta
    adminPreferences: AdminPreferences
}
