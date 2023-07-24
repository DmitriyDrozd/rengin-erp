import * as FSA from '@sha/fsa';
import {StoneStatus} from "./StatusesMatrix";
import {ISOState} from "../../ISOState";
import createBootableDuck from '@sha/fsa/src/createBootableDuck'

export type RoleVO = {
    layers: string[]
    roleId: number
    name: string
    description: string
    destinationStatusesIds: number[]
    sourceStatusesIds: number[]
}

export const defaultSettings = {
    statuses: [] as StoneStatus[],
    roles: [] as RoleVO[]
}

export type Settings = typeof defaultSettings


const duck = createBootableDuck('settings',defaultSettings)

export const settingsDuck = {
    ...duck,

    selectSettings: (state): Settings =>
        state.app.bootstrap.settings,
    selectStatuses: (state): StoneStatus[] => {
        return state.app.bootstrap.settings.statuses
    },
    selectStatusById: (statusId) => (state: ISOState): StoneStatus => {
        return state.app.bootstrap.settings.statuses.find(s => s.statusId === statusId)
    },
    reducer: (state = defaultSettings, action): Settings => {
        if (duck.actions.reset.isType(action))
            return action.payload

        return state
    }
}

export default settingsDuck

