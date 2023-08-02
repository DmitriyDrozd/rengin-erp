import * as fsa from '@sha/fsa'
import {put, select, takeLatest} from 'typed-redux-saga'
import {uiDuck} from './uiDuck';
import {getUserStorage} from '../../app-storage';

export type Preferences = typeof defaultPreferences

const factory = fsa.actionCreatorFactory('preferences')


const actions = {
    setKey: factory<{ key: keyof Preferences, value: Preferences[keyof Preferences] }>('setKey'),
    localUserPreferencesLoaded: factory< Preferences >('localUserPreferencesLoaded')
}


export function* preferencesSaga() {
    yield* takeLatest(uiDuck.actions.loggedIn.isType, managePreferencesForUser)
}

function* managePreferencesForUser(action: ReturnType<typeof uiDuck.actions.loggedIn>) {
    const email = action.payload.email
    const key = `preferences`

    let data = defaultPreferences
    const storage = getUserStorage(email)

    if (storage.hasItem(key)) {
        const others = storage.getItem(key)
        data = {...data, ...others}
    }

    yield* put(actions.localUserPreferencesLoaded(data as any as Preferences))



    yield* takeLatest(preferencesDuck.actions.setKey.isType, function* (action) {
        const data = yield* select(preferencesDuck.selectPreferences)
        getUserStorage(email).setItem(key, data)
    })

    return data
}

export const defaultPreferences = {
    role: 0,
    toastsEventsFeed: true,
    animatedColors: false,
    ionModeMaterial: false,
    darkMode: false,
    showExamples: false,
    showFPS: false
}


const reducer = (state = defaultPreferences, action) => {
    if (actions.setKey.isType(action)) {
        return {...state, [action.payload.key]: action.payload.value}
    }
    return state
}


export const selectPreferences = (state): Preferences =>
    state.app.preferences


export const preferencesDuck = {
    actions,
    reducer: (state: Preferences, action): Preferences => {
        if (actions.localUserPreferencesLoaded.isType(action))
            return action.payload as any as Preferences
        else
            return reducer(state, action)
    },
    selectPreferences,
    factory,
}

