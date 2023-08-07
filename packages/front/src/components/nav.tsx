import React from 'react'
import {ExtractRouteParams, routeBuilder, RoutePath} from '@sha/router'
import LoginPage from './pages/LoginPage'
import {Route, RouteComponentProps} from 'react-router'
import UsersListPage from './pages/users/UsersListPage'
import {UserPage} from './pages/users/UserItemPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'

import StartPage from './pages/StartPage'
import BrandsChapter from './pages/clients/BrandsChapter'
import LegalsChapter from './pages/clients/LegalsChapter'
import SitesChapter from './pages/clients/SitesChapter'
import ContractsChapter from './pages/contracts/ContractsChapter'


type RouteRenderProps<RPath extends RoutePath> = RouteComponentProps<ExtractRouteParams<RPath>>
export type RouteScreen<RPath extends RoutePath> = React.ComponentType<RouteRenderProps<RPath> &
    ExtractRouteParams<RPath>>
export * from '@sha/router'

const buildNav = <Path extends string, Comp extends RouteScreen<Path>>
    (path: Path, Component: Comp) => {
        const builder = routeBuilder(path)
        return Object.assign(builder, {
            Component
        })
    }

export type BuildNav = ReturnType<typeof buildNav>


export const nav = {
    index: buildNav('/', () => <div></div>),
    login: buildNav('/app/login', LoginPage),
    forgot: buildNav('/app/forgot', ForgotPasswordPage),
    start: buildNav('/app/in/start', StartPage),
   // issuesList: buildNav('/app/in/issues',ContractsListPage ),
    usersList: buildNav('/app/in/users', UsersListPage),
    userPage: buildNav('/app/in/users/:userId', (props) =><UserPage id={props.userId} />),

    brandsList: buildNav('/app/in/brands', BrandsChapter),
    brandsCreate: buildNav('/app/in/brands/create', BrandsChapter),
    brandsEdit: buildNav('/app/in/brands/:brandId', BrandsChapter),

    legalsList: buildNav('/app/in/legals', LegalsChapter),
    legalsCreate: buildNav('/app/in/legals/create', LegalsChapter),
    legalsEdit: buildNav('/app/in/legals/:legalId', LegalsChapter),

    sitesList: buildNav('/app/in/sites', SitesChapter),
    sitesCreate: buildNav('/app/in/sites/create', SitesChapter),
    sitesEdit: buildNav('/app/in/sites/:siteId', SitesChapter),

    contractsList: buildNav('/app/in/contracts', ContractsChapter),
    contractsCreate: buildNav('/app/in/contracts/create', ContractsChapter),
    contractsEdit: buildNav('/app/in/contracts/:contractsId', ContractsChapter),
    //addressesList: buildNav('/app/in/addresses', AddressesListPage),
   // addressPage: buildNav('/app/in/addresses/:addressId', props => <AddressItemPage id={props.addressId}/>),
   // contractsList: buildNav('/app/in/contracts', ContractsListPage),
   // contractsPage: buildNav('/app/in/contracts/:contractId', props => <ContractItemPage id={props.contractId}/>),

}


export type Nav = typeof nav
export type KeyOfNav = keyof Nav

export const rootRoutes = Object.values(nav)
    .map(({Component, pattern, exact}) => (
        <Route
            exact={true}
            key={pattern}
            path={pattern}
            render={routeProps => {
                // @ts-ignore
                return (
                    <Component {...routeProps} {...routeProps.match.params} />
                )
            }}
        />
    ))
