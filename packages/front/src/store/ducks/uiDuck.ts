import * as fsa from '@sha/fsa'
import {FactoryAnyAction} from '@sha/fsa'
import {append, equals, reject, uniq} from 'ramda'
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

export type Role = number

export type Mode = 'singular' | 'multiple'

const defaultDeviceInfo = {
    isTouchEnabled: false

}

export type DeviceInfo = typeof defaultDeviceInfo
const deviceInfoReducer = (state = defaultDeviceInfo, action: FactoryAnyAction) => {
    if (actions.setDeviceInfo.isType(action))
        return action.payload
    return state
}
const actions = {
    sweepModeOn: factory<undefined>('sweepModeOn'),
    setDisableUnavailableElements: factory<boolean>('setDisableUnavailableElements'),
    sweepModeOff: factory<undefined>('sweepModeOff'),
    stoneClicked: factory<string | undefined>('stoneClicked'),
    preloaded: factory<undefined>('PRELOADED'),
    setDeviceInfo: factory<DeviceInfo>('setDeviceInfo'),
    searchResultSelected: factory<{ ids: string[] }>('searchResultSelected'),
    setSelection: factory<string[]>('setSelection'),
    setPending: factory<string>('setPending'),

    removePending: factory<undefined>('removePending'),
    busy: factory<any>('busy'),
    focusToDefault: factory<undefined>('focusToDefault'),
    focusToList: factory<string[]>('focusToList'),
    unbusy: factory<any>('unbusy'),
    setLang: factory<string>('setLang'),
    setTheme: factory<string>('setTheme'),
    nextStep: factory<any>('nextStep'),
    showModal: factory<ModalType>('showModal'),
    hideModal: factory<ModalType>('hideModal'),
    showToast: factory<ToastDescriptor>('showToast'),
    hideToast: factory<{ id: string }>('hideToast'),
    setWalletID: factory<string>('setWalletId'),
    setShowMemo: factory<boolean>('setShowMemo'),
    updateAccount: factory<string>('updateAccount'),
    loadMoreRequested: factory<string>('loadMoreRequested'),
    loadMoreCompleted: factory<string>('loadMoreCompleted'),
    showConfirm: factory<{ text: string, title?: string, action: any }>('showConfirm'),
    hideConfirm: factory<{} | undefined | never>('hideConfirm'),
    makePayment: factory<{ destination: string, code?: string, issuer?: string, secret: string, amount: string }>('makePayment'),
    setRole: factory<Role>('setRole'),
    setLogin: factory<string | undefined>('setLogin'),
    setSeqNum: factory<string>('setSeqNum'),
    loginRequested: factory<{ email, password }>('loginRequested'),
    loggedIn: factory<LoginPayload>('loggedIn'),
    loggedOut: factory<any | undefined>('loggedOut'),
    logout: factory<any | undefined>('logout'),
    setLogRocketURL: factory<string | undefined>('setLogRocketURL'),

    encryptionKeyImported: factory<string>('encryptionKeyImported'),
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

const showMemoReducer = (state: 'true' | 'false' = 'false', action: FactoryAnyAction): 'true' | 'false' => {
    if (actions.setShowMemo.isType(action))
        return action.payload
    return state
}

const themeReducer = (state: string = 'dark', action: FactoryAnyAction): string => {
    if (actions.setTheme.isType(action))
        return action.payload
    return state
}


const loadMoreReducer = (state: string[] = [], action: FactoryAnyAction) => {
    if (actions.loadMoreRequested.isType(action))
        return uniq([...state, action.payload])
    else (actions.loadMoreRequested.isType(action))
    return reject(equals(action.payload), state)
    return state
}

const walletReducer = (state: string = '', action: FactoryAnyAction): string => {
    if (actions.setWalletID.isType(action))
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
    showMemo: showMemoReducer,
    confirm: confirmReducer,
    loadingList: loadMoreReducer,
    deviceInfo: deviceInfoReducer,

    sweepMode: (state: boolean = false, action) => {
        if (actions.sweepModeOn.isType(action))
            return true
        if (actions.sweepModeOff.isType(action))
            return false
        return state
    },

    disableUnavailableElements: actions.setDisableUnavailableElements.payloadReducerWithInitialState(false),

    preloaded: (state = false, action) => {
        if (actions.preloaded.isType(action))
            return true
        return state
    },

    selection: (state: Selection = {ids: [], mode: 'singular'}, action) => {
        if (actions.setSelection.isType(action)) {


            return {...state, ids: action.payload}
        }
        if (actions.setMode.isType(action)) {
            return {...state, mode: action.payload}
        }
        return state
    },
    seqNum: actions.setSeqNum.payloadReducer,
    role: (state = 0, action) => {
        if (actions.setRole.isType(action))
            return action.payload
        return state
    },
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
    selectSweepMode: (state: FrontState): boolean => state.ui.sweepMode as any as boolean,
    selectRole: (state) => state.ui.roleId,
    selectSelection: (state: FrontState): string[] =>
        state.ui.selection.ids ? state.ui.selection.ids : []
}
