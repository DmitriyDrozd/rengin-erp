import {createContext, useContext} from "react";
import {TicketVO} from "iso";
import * as FSA from '@shammasov/mydux'
import {FactoryAnyAction} from '@shammasov/mydux'


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
export const issueEditReducer = (state: TicketVO, action: FactoryAnyAction) => {
    if(actions.propertyUpdated.isType(action)) {
        return {...state, [action.payload.key]: action.payload.value}
    }
    return state
}
export const issueEditor = {
    actions,
    reducer: issueEditReducer
}

export type IssuePropertySetter = <K extends keyof TicketVO>(prop: K) =>
    <V extends TicketVO[K]>(value: V) => any

export const IssueStateContext = createContext<{issue: TicketVO, setIssue: (value: TicketVO)=>any,
    setIssueProperty: <K extends keyof TicketVO>(prop: K) =>
        <V extends TicketVO[K]>(value: V) => any }>({} as any )

export default () => {
    const {issue,setIssue,setIssueProperty} =useContext(IssueStateContext)
    return {
        issue,
        setIssue,
        setIssueProperty
    }
}