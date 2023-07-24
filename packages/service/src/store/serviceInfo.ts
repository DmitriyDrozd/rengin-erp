import * as FSA from '@sha/fsa'

const factory = FSA.actionCreatorFactory('serviceInfo')
const actions = {
    serviceStartedCreator: factory<any>('serviceStarted'),
    sendTgNotification: factory<string>('sendTgNotification'),
}


export const serviceInfoDuck = {
    actions,
    reducer: (state = false, action) => {
        if (actions.serviceStartedCreator.isType(action))
            return true
        return false
    }
}
