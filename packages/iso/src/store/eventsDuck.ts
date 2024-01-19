import * as FSA from '@sha/fsa'
import type {EventVO} from 'service/src/repositories/eventStore'
import {ISOState} from '../ISOState'
import {ResourcesMap} from './bootstrap/resourcesList'

const factory = FSA.actionCreatorFactory('events')

type AnyRID = ResourcesMap[keyof ResourcesMap]['idProp']

export type IndexedEventVO= {
    id: string
    brandId: string
    contractId: string
    issueId: string
    legalId: string
    siteId: string
    subId: string
    guid: string
    type: string
    userId: string
    payload: string
}

const actions = {
    reset: factory<EventVO[]>('reset'),
    append: factory<EventVO>('append'),
    focus: factory<string| number>('focus'),
}

const reducer = (state: EventVO[], action: EventVO) => {
    if(actions.append.isType(action)) {
            return [...state, action]
        }

    if(actions.reset.isType(action))
        return action
    return state
}

export const eventsDuck = {
    reducer,
    actions,
    selectAllEvents: (state: ISOState) => state.app.events,
  }