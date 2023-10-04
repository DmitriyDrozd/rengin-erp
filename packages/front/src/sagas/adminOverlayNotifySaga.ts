import {select, takeEvery} from 'typed-redux-saga'

import {FactoryAnyAction} from '@sha/fsa'
import sseConnectionDuck from 'iso/src/store/sse/sseConnectionDuck';
import {getResourceByAction} from 'iso/src/store/bootstrap/resourcesList'
import {notification} from 'antd'

let fired = []

export function* adminNotifySaga() {

    const isSuccessActions = (action: FactoryAnyAction) =>
       Boolean (  sseConnectionDuck.actions.clientPushSuccess.isType(action) ||
        sseConnectionDuck.actions.serverPushed.isType(action) )

    yield* takeEvery((action) => {
        return Boolean( sseConnectionDuck.actions.clientPushSuccess.isType(action) /*||
            sseConnectionDuck.actions.serverPushed.isType(action)*/)
        }, function* (pushAction) {
        if(fired.includes(pushAction.guid))
            return
        fired.push(pushAction.guid)
            const action = pushAction.payload
            const res = getResourceByAction(action)
        const item = yield* select(res.selectById(action.payload[res.idProp]))
            if(res && item) {
                const itemName = res.getItemName(item)
                if(res.actions.added.isType(action)) {
                    notification.open({
                        message: itemName + ' добавлен',
                        description: 'Вы добавили новый '+res.langRU.some,
                        type: 'success'
                    })
                }
                else if(res.actions.updated.isType(action) || res.actions.patched.isType(action)) {
                    notification.open({
                        message: itemName,
                        description: 'Вы обновили '+res.langRU.some,
                        type: 'info'
                    })
                }
                else if(res.actions.removed.isType(action)) {
                    notification.open({
                        message: itemName,
                        description: 'Запись '+res.langRU.some+' удалена',
                        type: 'warning'
                    })
                }
            }
        }
    )
}
