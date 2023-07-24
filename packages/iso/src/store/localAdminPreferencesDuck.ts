import * as FSA from '@sha/fsa'
import {ISOState} from '../ISOState'
import appStorage from '../appStorage'
import {select, takeLatest} from 'typed-redux-saga'
import mergeDeep from '@sha/utils/mergeDeep'

const appStorageItemId = 'localAdminPreferences'

const defaultAdminPreferences = {
    liveEventFeedOverlay: true,
}

export type AdminPreferences = typeof defaultAdminPreferences

const factory = FSA.actionCreatorFactory('preferences')

const actions = {
    updated: factory<AdminPreferences>('updated')
}

const reducer = FSA.reducerWithInitialState(
    appStorage.getItem(appStorageItemId, defaultAdminPreferences) as AdminPreferences
).case(actions.updated, (state, payload) => {
        const r = mergeDeep<AdminPreferences>(state)(payload)
        return r as any as AdminPreferences
    }
)

const selectPreferences = (state: ISOState): AdminPreferences =>
    state.adminPreferences

function* adminPreferencesSaga() {
    yield* takeLatest(actions.updated.isType, function* (action) {
        const state = yield* select(selectPreferences)
        appStorage.setItem('localAdminPreferences', state)
    })
}

export default {
    adminPreferencesSaga,
    actions,
    factory,
    reducer,
    selectPreferences
}
