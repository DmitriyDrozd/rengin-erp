import {createContext, useContext} from "react";
import {IssueVO} from "iso/src/store/bootstrap/repos/issues";
import * as FSA from '@sha/fsa'
import {FactoryAnyAction} from '@sha/fsa'


const issueEditorFactory = FSA.actionCreatorFactory('issueEditor')

export type UpdatePropertyPayload<Item = any, K extends keyof Item = keyof Item> = {
    key: K
    value: Item[K]
}

export type MergeStatePayload<Item = any> = Partial<Item>

const actions = {
    propertyUpdated: issueEditorFactory<UpdatePropertyPayload>('propertyUpdated'),
    stateMerged: issueEditorFactory<MergeStatePayload>('stateMerged')
}
export const issueEditReducer = (state: IssueVO, action: FactoryAnyAction) => {
    if(actions.propertyUpdated.isType(action)) {
        return {...state, [action.payload.key]: action.payload.value}
    }
    return state
}
export const issueEditor = {
    actions,
    reducer: issueEditReducer
}

export type IssuePropertySetter = <K extends keyof IssueVO>(prop: K) =>
    <V extends IssueVO[K]>(value: V) => any

export const IssueStateContext = createContext<{issue: IssueVO, setIssue: (value: IssueVO)=>any,
    setIssueProperty: <K extends keyof IssueVO>(prop: K) =>
        <V extends IssueVO[K]>(value: V) => any }>({} as any )

export default () => {
    const {issue,setIssue,setIssueProperty} =useContext(IssueStateContext)
    return {
        issue,
        setIssue,
        setIssueProperty
    }
}