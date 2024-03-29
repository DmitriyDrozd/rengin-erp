import React from 'react';
import {
    ExtractRouteParams,
    routeBuilder,
    RoutePath
} from '@sha/router';
import {
    Route,
    RouteComponentProps
} from 'react-router';
import moize from 'moize';
import { ImportEmployeesPage } from './pages/import/ImportEmployeesPage';

import LoginPage from './pages/LoginPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import StartPage from './pages/StartPage';
import BrandsChapter from './pages/brands/BrandsChapter.js';
import LegalsChapter from './pages/clients/LegalsChapter';
import SitesChapter from './pages/clients/SitesChapter';
import ContractsChapter from './pages/contracts/ContractsChapter';
import SubsChapter from './pages/contracts/SubsChapter';
import ImportSitesPage from './pages/import/ImportSItesPage';
import { ImportIssuesPage } from './pages/import/ImportIssuesPage';
import IssuesListPage from './pages/issues/IssuesListPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import UsersChapter from './pages/users/UsersListPage';
import EmployeesChapter from './pages/employees/EmployeesListPage';


type RouteRenderProps<RPath extends RoutePath> = RouteComponentProps<ExtractRouteParams<RPath>>
export type RouteScreen<RPath extends RoutePath> = React.ComponentType<RouteRenderProps<RPath> &
    ExtractRouteParams<RPath>>
export * from '@sha/router';

const buildNav = <Path extends string, Comp extends RouteScreen<Path>>
(path: Path, Component: Comp) => {
    const builder = routeBuilder(path);
    return Object.assign(builder, {
        Component
    });
};

export type BuildNav = ReturnType<typeof buildNav>


export const getNav = moize(() => {
    return {
        index: buildNav('/', () => <div></div>),
        login: buildNav('/app/login', LoginPage),
        forgot: buildNav('/app/forgot', ForgotPasswordPage),
        start: buildNav('/app/in/start', StartPage),
        // issuesList: buildNav('/app/in/issues',ContractsListPage ),
        usersList: buildNav('/app/in/users', UsersChapter),

        employeesList: buildNav('/app/in/employees', EmployeesChapter),
        employeesCreate: buildNav('/app/in/employees/create', EmployeesChapter),
        employeesEdit: buildNav('/app/in/employees/:employeeId', EmployeesChapter),

        brandsList: buildNav('/app/in/brands', BrandsChapter),

        legalsList: buildNav('/app/in/legals', LegalsChapter),
        legalsCreate: buildNav('/app/in/legals/create', LegalsChapter),
        legalsEdit: buildNav('/app/in/legals/:legalId', LegalsChapter),

        sitesList: buildNav('/app/in/sites', SitesChapter),
        sitesCreate: buildNav('/app/in/sites/create', SitesChapter),
        sitesEdit: buildNav('/app/in/sites/:siteId', SitesChapter),

        contractsList: buildNav('/app/in/contracts', ContractsChapter),
        contractsCreate: buildNav('/app/in/contracts/create', ContractsChapter),
        contractsEdit: buildNav('/app/in/contracts/:contractsId', ContractsChapter),

        subsList: buildNav('/app/in/subs', SubsChapter),
        subsCreate: buildNav('/app/in/subs/create', SubsChapter),
        subsEdit: buildNav('/app/in/subs/:subId', SubsChapter),

        importSites: buildNav('/app/in/import-sites', ImportSitesPage),
        importIssues: buildNav('/app/in/import-issues', ImportIssuesPage),
        importEmployees: buildNav('/app/in/import-employees', ImportEmployeesPage),

        issues: buildNav('/app/in/issues', IssuesListPage),
        issuesEdit: buildNav('/app/in/issues/:issueId', IssuesListPage),
        // issueCreate: buildNav('/app/in/issues/create', AddIssuePage),

        dashboard: buildNav('/app/in/dashboard', DashboardPage)
        //addressesList: buildNav('/app/in/addresses', AddressesListPage),
        // addressPage: buildNav('/app/in/addresses/:addressId', props => <AddressItemPage id={props.addressId}/>),
        // contractsList: buildNav('/app/in/contracts', ContractsListPage),
        // contractsPage: buildNav('/app/in/contracts/:contractId', props => <ContractItemPage id={props.contractId}/>),

    };
});


export type Nav = typeof getNav
export type KeyOfNav = keyof Nav
/**
export const rootRoutes = collectBy(prop('Component'),Object.values(getNav()))
    .map((navs: BuildNav[]) => {
        const Comp =navs[0].Component
        const path = navs.map(n => n.pattern)

        return (
            <Route
                exact={false}
                key={navs[0].pattern}
                path={path[0]}
                render={routeProps => {
                    // @ts-ignore
                    return (
                        <Comp {...routeProps} {...routeProps.match.params} />
                )
                }}
            />
        )
    })
*/
export const rootRoutes = () =>
    Object.values(getNav())
        .map(({Component, pattern}) => (
            <Route
                exact={true}
                key={pattern}
                path={pattern}
                render={routeProps => {
                    // @ts-ignore
                    return (
                        <Component {...routeProps} {...routeProps.match.params} />
                    );
                }}
            />
        ));
