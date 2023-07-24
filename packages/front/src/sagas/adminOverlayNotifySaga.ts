import {select, takeEvery} from 'typed-redux-saga'

import {FactoryAction} from '@sha/fsa'

import {uiDuck} from "../store/ducks/uiDuck"
import sseConnectionDuck from "iso/src/store/sse/sseConnectionDuck";


export function* adminNotifySaga() {
    yield* takeEvery(sseConnectionDuck.actions.serverPushed.isType, function* (pushAction) {
            // const pref: AdminPreferences = yield* select(localAdminPreferencesDuck.selectPreferences)
            const role = yield* select(uiDuck.selectRole)
            if (role === 'admin') {
                const {type, ...action}: FactoryAction<any> = pushAction.payload
                /*  if (pref.liveEventFeedOverlay)
                      notification.open({
                          message: type,
                          description: '',//React.createElement(JSONTree, {value: action.payload}),
                          duration: 20,
                      })*/
            }
        }
    )
}
