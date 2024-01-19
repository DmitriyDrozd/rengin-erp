import * as fsa from '@sha/fsa'
import {FactoryAnyAction} from '@sha/fsa'
import {append, equals, reject} from 'ramda'
import {combineReducers} from 'redux'
import {FrontState} from '../frontReducer';

export type UIState = ReturnType<typeof reducer>

const factory = fsa.actionCreatorFactory('ui')

export type ToastType = 'Success' | 'Info' | 'Error'
export type ToastDescriptor = { id: string, title: string, message?: string, type: ToastType }

export type LoginPayload = {
    email: string
    password: string
    remember: boolean
}

export type Selection = {
    ids: string[]
    mode: Mode
}



export type Mode = 'singular' | 'multiple'

const defaultDeviceInfo = {
    isTouchEnabled: false

}


const actions = {
    preloaded: factory<undefined>('PRELOADED'),
    setPending: factory<string>('setPending'),
    removePending: factory<undefined>('removePending'),
    busy: factory<any>('busy'),
    unbusy: factory<any>('unbusy'),
    setLang: factory<string>('setLang'),
    setTheme: factory<string>('setTheme'),
    showModal: factory<ModalType>('showModal'),
    hideModal: factory<ModalType>('hideModal'),
    showToast: factory<ToastDescriptor>('showToast'),
    hideToast: factory<{ id: string }>('hideToast'),
    setShowMemo: factory<boolean>('setShowMemo'),
    showConfirm: factory<{ text: string, title?: string, action: any }>('showConfirm'),
    hideConfirm: factory<{} | undefined | never>('hideConfirm'),
    setLogin: factory<string | undefined>('setLogin'),
    setSeqNum: factory<string>('setSeqNum'),
    loginRequested: factory<{ email, password }>('loginRequested'),
    loggedIn: factory<LoginPayload>('loggedIn'),
    loggedOut: factory<any | undefined>('loggedOut'),
    logout: factory<any | undefined>('logout'),
    setLogRocketURL: factory<string | undefined>('setLogRocketURL'),

    setMode: factory<Mode>('setMode'),

}

const defaultConfirmState = {
    text: undefined as string,
    title: undefined as string,
    action: undefined as FactoryAnyAction
}


const confirmReducer = (state = defaultConfirmState, action: FactoryAnyAction) => {
    if (actions.showConfirm.isType(action))
        return action.payload
    if (actions.hideConfirm.isType(action))
        return defaultConfirmState
    return state
}


const themeReducer = (state: string = 'dark', action: FactoryAnyAction): string => {
    if (actions.setTheme.isType(action))
        return action.payload
    return state
}



const busyReducers = (state: any[] = [], action: FactoryAnyAction): any[] => {
    if (actions.busy.isType(action))
        return append(action.payload, state)

    if (actions.unbusy.isType(action))
        // @ts-ignore
        return reject(equals(action.payload), state)

    if (actions.unbusy.isType(action))
        // @ts-ignore
        return reject(equals(action.payload), state)

    return state
}

const modalsReducer = (state: string[] = [], action: FactoryAnyAction): any[] => {
    if (actions.showModal.isType(action))
        return append(action.payload, state)

    if (actions.hideModal.isType(action))
        // @ts-ignore
        return reject(equals(action.payload), state)

    return state
}

const toastsReducer = (state: ToastDescriptor[] = [] as ToastDescriptor[], action: typeof actions.showToast.example | typeof actions.hideToast.example): ToastDescriptor[] => {
    if (actions.showToast.isType(action))
        return append(action.payload, state) as ToastDescriptor[]

    if (actions.hideToast.isType(action))
        return reject(t => t === action.payload.id, state) as ToastDescriptor[]

    return state
}

const pending = (state = '', action): string => {
    if (actions.setPending.isType(action))
        return action.payload
    else if (actions.removePending.isType(action))
        return ''
    return state
}


const reducer = combineReducers({
    pending: pending,
    busy: busyReducers,
    modals: modalsReducer,
    toasts: toastsReducer,
    theme: themeReducer,
    confirm: confirmReducer,


    preloaded: (state = false, action) => {
        if (actions.preloaded.isType(action))
            return true
        return state
    },


    seqNum: actions.setSeqNum.payloadReducer,

    logRocketURL: actions.setLogRocketURL.payloadReducer,

    login: actions.setLogin.payloadReducer,

})


export const selectUI = (state): UIState =>
    state.ui

export type ModalType = 'SendBillexModel' | 'RecieveBillexModal' | 'BuyBillexWithCardModal'

export const uiDuck = {
    actions,
    reducer,
    selectUI,
    selectPending: (state: FrontState): string => state.ui.pending,
}
