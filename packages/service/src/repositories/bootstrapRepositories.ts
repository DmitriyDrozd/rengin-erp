import duckRepo from './duckRepo'
import {CONTRACTS} from 'iso/src/store/bootstrap/repos/contracts'
import {ISSUES} from 'iso/src/store/bootstrap/repos/issues'
import {BRANDS} from 'iso/src/store/bootstrap/repos/brands'
import {AnyFields, Resource} from 'iso/src/store/bootstrap/core/createResource'
import {USERS} from 'iso/src/store/bootstrap/repos/users'
import buildMongooseByResource from './buildMongooseByResource'
import {LEGALS} from 'iso/src/store/bootstrap/repos/legals'
import {SITES} from 'iso/src/store/bootstrap/repos/sites'

export default async (mongo) => {

    const makeRepo = async <RID extends string, P extends AnyFields>(res: Resource<RID,P>) => {
        return await duckRepo({mongo}, res, buildMongooseByResource(res) )
    }

    return ({

        UsersRepo: await makeRepo( USERS ),
        BrandsRepo: await makeRepo(BRANDS),
        LelagsRepo: await makeRepo(LEGALS),
        RealtyRepo: await makeRepo(SITES),
        ContractsRepo: await makeRepo(CONTRACTS)    ,
IssuesRepo: await makeRepo(ISSUES)
        // IssuesRepo: await makeRepo({mongo}, issuesCrud, IssuesSchema),
        // AddressesRepo: await makeRepo({mongo}, addressesCrud, AddressesSchema),
        // CompaniesRepo: await makeRepo({mongo}, companiesCrud, CompanySchema),
        //BrandsRepo: await makeRepo({mongo}, brandsCrud, BrandSchema),
    })
}