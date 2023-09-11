import * as fsa from '@sha/fsa'
import {combineReducers} from 'redux'
import configDuck from './bootstrap/configDuck'
import settingsDuck from './bootstrap/settingsDuck';
import {ISOState} from '../ISOState'
import {toAssociativeArray} from '@sha/utils'
import {default as USERS, UserVO} from './bootstrap/repos/users'
import {SITES, SiteVO} from './bootstrap/repos/sites'
import {CONTRACTS, ContractVO} from './bootstrap/repos/contracts'
import {ISSUES, IssueVO} from './bootstrap/repos/issues'
import {isCRUD} from '@sha/fsa/src/createCRUDDuck'
import {Duck} from '@sha/fsa/src/createBootableDuck'
import brandsCrud, {BRANDS, BrandVO} from './bootstrap/repos/brands'
import {LEGALS, LegalVO} from './bootstrap/repos/legals'
import SUBS, {SubVO} from './bootstrap/repos/subs'

const factory = fsa.actionCreatorFactory('bootstrap')

const actions = {
    fetchBootstrap: factory.async<Bootstrap>('fetchBootstrap'),
    serverStateBootstraped: factory<Bootstrap>(
        'serverStateBootstraped'
    )
}


export const bootstrapCrudsMap = {
    users: USERS,
    sites: SITES,
    contracts: CONTRACTS,
    issues: ISSUES,
    brands: BRANDS,
    legals: LEGALS,
    subs: SUBS,
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
    const sites = boot.sites as SiteVO[]
    const contracts = boot.contracts  as ContractVO[]
    const issues = boot.issues as  IssueVO[]
    const brands = boot.brands as BrandVO[]
    const legals = boot.legals  as LegalVO[]
    const subs = boot.subs  as SubVO[]

    const usersById = toAssociativeArray('userId')(users)
    const sitesById = toAssociativeArray('siteId')(sites)
    const contractsById = toAssociativeArray('contractId')(contracts)
    const issuesById = toAssociativeArray('issueId')(issues)
    const legalsById = toAssociativeArray('legalId')(legals)
    const brandsByName = toAssociativeArray('brandName')(brands)
    const legalsByName = toAssociativeArray('legalName')(legals)
    return {
        brandsByName,legalsByName,
        brandsList: brands,
        brands,
        legals,
        subs,
        legalsList: legals,
        legalsById,
        usersById ,
        sitesById,
        sitesList: sites,
        contractsById,
        contractsList: contracts,
        issuesById,
        users, sites,contracts,issues
    }
}