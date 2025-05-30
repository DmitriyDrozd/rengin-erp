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
import { BackupPage } from './pages/backup/BackupPage';
import { ExpensesListPage } from './pages/expenses/ExpensesListPage';
import { ImportEmployeesPage } from './pages/import/ImportEmployeesPage';

import LoginPage from './pages/LoginPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import FeedbackPage from './pages/FeedbackPage';
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
import { TasksListPage } from './pages/tasks/TasksListPage';
import UsersChapter from './pages/users/UsersListPage';
import ProfilePage from './pages/ProfilePage';
import { EmployeesBlacklist, EmployeesChapter, EmployeesChecked, EmployeesProvided } from './pages/employees/EmployeesByCategory';
import WorkTypesChapter from './pages/employees/WorkTypeChapter';


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
        feedback: buildNav('/app/feedback', FeedbackPage),
        start: buildNav('/app/in/start', StartPage),
        profile: buildNav('/app/in/profile', ProfilePage),
        // issuesList: buildNav('/app/in/issues',ContractsListPage ),
        usersList: buildNav('/app/in/users', UsersChapter),
        backup: buildNav('/app/in/backup', BackupPage),

        // employeesList: buildNav('/app/in/employees', EmployeesChapter),
        employeesListProvided: buildNav('/app/in/employees/provided', EmployeesProvided),
        employeesListChecked: buildNav('/app/in/employees/checked', EmployeesChecked),
        employeesListBlacklist: buildNav('/app/in/employees/blacklist', EmployeesBlacklist),

        employeesCreate: buildNav('/app/in/employees/provided/create', EmployeesChapter),

        employeesEditProvided: buildNav('/app/in/employees/provided/:employeeId', EmployeesProvided),
        employeesEditChecked: buildNav('/app/in/employees/checked/:employeeId', EmployeesChecked),
        employeesEditBlacklist: buildNav('/app/in/employees/blacklist/:employeeId', EmployeesBlacklist),

        workTypesList: buildNav('/app/in/worktypes', WorkTypesChapter),
        workTypesCreate: buildNav('/app/in/worktypes/create', WorkTypesChapter),
        workTypesEdit: buildNav('/app/in/worktypes/:worktypeId', WorkTypesChapter),

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

        tasksList: buildNav('/app/in/tasks', TasksListPage),
        tasksEdit: buildNav('/app/in/tasks/:taskId', TasksListPage),

        importSites: buildNav('/app/in/import-sites', ImportSitesPage),
        importIssues: buildNav('/app/in/import-issues', ImportIssuesPage),
        importEmployees: buildNav('/app/in/import-employees', ImportEmployeesPage),

        issues: buildNav('/app/in/issues', IssuesListPage),
        issuesEdit: buildNav('/app/in/issues/:issueId', IssuesListPage),

        expenses: buildNav('/app/in/expenses', ExpensesListPage),
        expensesEdit: buildNav('/app/in/expenses/:expenseId', ExpensesListPage),

        dashboard: buildNav('/app/in/dashboard', DashboardPage)
    };
});


export type Nav = typeof getNav

export const rootRoutes = () =>
    Object.values(getNav())
        .map(({Component, pattern}) => (
            <Route
                exact={true}
                key={pattern}
                path={pattern}
                render={routeProps => <Component {...routeProps} {...routeProps.match.params} />}
            />
        ));
