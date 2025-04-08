import { EXPENSES, NOTIFICATIONS } from 'iso/src/store/bootstrap';
import {CONTRACTS} from 'iso/src/store/bootstrap/repos/contracts'
import {ISSUES} from 'iso/src/store/bootstrap/repos/issues'
import {BRANDS} from 'iso/src/store/bootstrap/repos/brands'
import TASKS from 'iso/src/store/bootstrap/repos/tasks';
import USERS from 'iso/src/store/bootstrap/repos/users'
import {LEGALS} from 'iso/src/store/bootstrap/repos/legals'
import {SITES} from 'iso/src/store/bootstrap/repos/sites'
import {EMPLOYEES} from 'iso/src/store/bootstrap/repos/employees'
import SUBS from 'iso/src/store/bootstrap/repos/subs'
import {SagaOptions} from "../sagaOptions";
import buildPGSchema from "../store/buildPGSchema";
import {call, fork, take} from "typed-redux-saga";
import {getRepo} from "./getRepo";
import duckRepoSaga from "./duckRepoSaga";
import {config} from "@app-config/main";

export function* bootstrapRepositories(io: SagaOptions) {

    if(config.WRITE_PG===true) {
        const respawnPGResult = yield* call(buildPGSchema, io)
    }
    const build = async () => {
        return ({

            UsersRepo: await getRepo(USERS, io),
            BrandsRepo: await getRepo(BRANDS, io),
            LegalsRepo: await getRepo(LEGALS, io),
            SitesRepo: await getRepo(SITES, io),
            ContractsRepo: await getRepo(CONTRACTS, io),
            SubsRepo: await getRepo(SUBS, io),
            IssuesRepo: await getRepo(ISSUES, io),
            EmployeesRepo: await getRepo(EMPLOYEES, io),
            ExpensesRepo: await getRepo(EXPENSES, io),
            TasksRepo: await getRepo(TASKS, io),
            NotificationsRepo: await getRepo(NOTIFICATIONS, io),

            // IssuesRepo: await makeRepo({mongo}, issuesCrud, IssuesSchema),
            // AddressesRepo: await makeRepo({mongo}, addressesCrud, AddressesSchema),
            // CompaniesRepo: await makeRepo({mongo}, companiesCrud, CompanySchema),
            //BrandsRepo: await makeRepo({mongo}, brandsCrud, BrandSchema),
        })
    }

    const repos = yield* call(build)

    for(let n in repos) {
        const repo = repos[n]
        yield* fork(duckRepoSaga, repo, io)
        const action = yield* take(repo.actions.reset.isType)
        console.log('Repo '+n+ ' is ready. '+action.payload.length+' items found')
    }
    return repos
}