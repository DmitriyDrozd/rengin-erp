import getMongoDAO from './getMongoDAO'
import {CONTRACTS} from 'iso/src/store/bootstrap/repos/contracts'
import {ISSUES} from 'iso/src/store/bootstrap/repos/issues'
import {BRANDS} from 'iso/src/store/bootstrap/repos/brands'

import {Res} from 'iso/src/store/bootstrap/resourcesList'
import {AnyFieldsMeta, Resource} from 'iso/src/store/bootstrap/core/createResource'
import USERS from 'iso/src/store/bootstrap/repos/users'
import buildMongooseByResource from './buildMongooseByResource'
import {LEGALS} from 'iso/src/store/bootstrap/repos/legals'
import {SITES} from 'iso/src/store/bootstrap/repos/sites'
import SUBS from 'iso/src/store/bootstrap/repos/subs'
import {SagaOptions} from "../sagaOptions";
import {getPGDAO} from "./getPGDAO";
import buildPGSchema from "../store/buildPGSchema";
import {call, fork} from "typed-redux-saga";
import {getRepo} from "./getRepo";
import duckRepoSaga from "./duckRepoSaga";

export function* bootstrapRepositories(io: SagaOptions) {

    const respawnPGResult = yield* call(buildPGSchema,io)

    const build = async () => {
        return ({

            UsersRepo: await getRepo(USERS, io),
            BrandsRepo: await getRepo(BRANDS, io),
            LelagsRepo: await getRepo(LEGALS, io),
            RealtyRepo: await getRepo(SITES, io),
            ContractsRepo: await getRepo(CONTRACTS, io),
            IssuesRepo: await getRepo(ISSUES, io),
            SubsRepo: await getRepo(SUBS, io)
            // IssuesRepo: await makeRepo({mongo}, issuesCrud, IssuesSchema),
            // AddressesRepo: await makeRepo({mongo}, addressesCrud, AddressesSchema),
            // CompaniesRepo: await makeRepo({mongo}, companiesCrud, CompanySchema),
            //BrandsRepo: await makeRepo({mongo}, brandsCrud, BrandSchema),
        })
    }

    const repos = yield* call(build)

    for(let n in repos) {
        yield* fork(duckRepoSaga, repos[n], io)
    }
    return repos
}