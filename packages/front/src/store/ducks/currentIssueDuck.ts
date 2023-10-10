import {IssueVO} from "iso/src/store/bootstrap/repos/issues";
import {FactoryAnyAction} from "@sha/fsa";
import * as FSA from "@sha/fsa";
import {FrontState} from "../frontReducer";

const currentIssueFactory = FSA.actionCreatorFactory('issueEditor', {persistent: false})

export type UpdatePropertyPayload<K extends keyof IssueVO = keyof IssueVO, V extends IssueVO[K] = IssueVO[K]> = {
    key: K
    value: V
}

const actions = {
    generateNewIssue: currentIssueFactory<Partial<IssueVO>>('generateNewIssue',{}),
    setCurrentIssue: currentIssueFactory<IssueVO>('setCurrentIssueId'),
    updateProperty: currentIssueFactory<UpdatePropertyPayload>('updateProperty'),
    updateIssue: currentIssueFactory<IssueVO>('updateIssue'),
}

export const currentIssueReducer = (state: Partial<IssueVO> = {}, action: FactoryAnyAction) => {
    if(actions.generateNewIssue.isType(action)) {
        return {...action.payload}
    }
    if(actions.setCurrentIssue.isType(action)) {
        return {...action.payload}
    }
    if(actions.updateProperty.isType(action)) {
        return {...state, [action.payload.key]: action.payload.value}
    }
    if(actions.updateIssue.isType(action)) {
        return {...state, ...action.payload}
    }
    return state
}

const selectCurrentIssue = (state: FrontState) => {
    return state.app.currentIssue
}

const selectCurrentIssueProperty = <K extends keyof IssueVO>(prop: K) => (state: FrontState): IssueVO[K] =>
    selectCurrentIssue(state)[prop]

export const currentIssueDuck = {
    actions,
    reducer: currentIssueReducer,
    selectCurrentIssue,
    selectCurrentIssueProperty
}