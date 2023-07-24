import * as fsa from '@sha/fsa'
import {addressesCrud, contractsCrud, issuesCrud, usersCrud} from './bootstrap/index'
import {combineReducers, Reducer} from 'redux'
import {put, takeLatest} from 'typed-redux-saga'
import configDuck from './bootstrap/configDuck'
import settingsDuck from "./bootstrap/settingsDuck";
import {ISOState} from '../ISOState'
import {toAssociativeArray} from '@sha/utils'
import {UserVO} from './bootstrap/repos/user-schema'
import {AddressVO} from './bootstrap/repos/addresses-schema'
import {ContractVO} from './bootstrap/repos/contracts-schema'
import {IssueVO} from './bootstrap/repos/Issues-schema'
import {Crud, isCRUD} from '@sha/fsa/src/createCRUDDuck'
import {Duck} from '@sha/fsa/src/createBootableDuck'
import brandsCrud from './bootstrap/repos/brands-crud'
import companiesCrud from './bootstrap/companies-crud'

const factory = fsa.actionCreatorFactory('bootstrap')

const actions = {
    fetchBootstrap: factory.async<Bootstrap>('fetchBootstrap'),
    serverStateBootstraped: factory<Bootstrap>(
        'serverStateBootstraped'
    )
}


export const bootstrapCrudsMap = {
    users: usersCrud,
    addresses: addressesCrud,
    contracts: contractsCrud,
    issues: issuesCrud,
    brands: brandsCrud,
    companies: companiesCrud,
}
export const bootstrapDucksMap = {
    ...bootstrapCrudsMap,
    config: configDuck,

    settings: settingsDuck,
}

export const bootstrapDucks = Object.values(bootstrapDucksMap)
export const bootstrapCruds = bootstrapDucks.filter(isCRUD)


type ReducersMapByDuck<Type extends {[key in string]: Duck<any>}> = {
    [Property in keyof Type]: Type[Property]['reducer'];
};


const getReducersMapByDucks = <M extends {[key in string]: Duck<any> }>(ducks: M): ReducersMapByDuck<M> => {
    const reducers = {}
    Object.keys(ducks).forEach(k => reducers[ducks[k].factoryPrefix] = ducks[k].reducer)
    return  reducers as any
}



const reducer =combineReducers(getReducersMapByDucks(bootstrapDucksMap))/* combineReducers({
    config: configDuck.reducer,
    users: usersCrud.reducer,
    addresses: addressesCrud.reducer,
    contracts: contractsCrud.reducer,
    issues: issuesCrud.reducer,
    settings: settingsDuck.reducer,

})*/


export type Bootstrap = ReturnType<typeof reducer>




export const bootstrapDuck = {
    reducer,
    factory,
    actions,
    selectBootstrap: (state) =>
        state.app.bootstrap as Bootstrap,
}


export const selectLedger = (state: ISOState) => {
    const boot = state.app.bootstrap
    const users = boot.users as UserVO[]
    const addresses = boot.addresses as AddressVO[]
    const contracts = boot.contracts  as ContractVO[]
    const issues = boot.issues as  IssueVO[]
    const usersById = toAssociativeArray('userId')(boot.users)
    const addressesById = toAssociativeArray('addressId')(boot.addresses)
    const contractsById = toAssociativeArray('contractId')(boot.contracts)
    const issuesById = toAssociativeArray('issuesId')(boot.issues)
    return {
        usersById ,
        addressesById,
        contractsById,
        issuesById,
        users, addresses,contracts,issues
    }
}