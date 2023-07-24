import duckRepo from './duckRepo'
import {addressesCrud, contractsCrud, issuesCrud, usersCrud} from 'iso/src/store/bootstrap'
import {UserSchema} from 'iso/src/store/bootstrap/repos/user-schema'
import {ContractsSchema} from 'iso/src/store/bootstrap/repos/contracts-schema'
import {IssuesSchema} from 'iso/src/store/bootstrap/repos/Issues-schema'
import {AddressesSchema} from 'iso/src/store/bootstrap/repos/addresses-schema'
import companiesCrud from 'iso/src/store/bootstrap/companies-crud'
import {CompanySchema} from 'iso/src/store/bootstrap/companies-schema'
import {BrandSchema} from 'iso/src/store/bootstrap/repos/brands-schema'
import brandsCrud from 'iso/src/store/bootstrap/repos/brands-crud'

export default async (mongo) => ({
    UsersRepo: await duckRepo({mongo}, usersCrud, UserSchema),
    //  CommentsRepo: await duckRepo({mongo}, commentsCRUD, CommentSchema),
    ContractsRepo: await duckRepo({mongo}, contractsCrud, ContractsSchema),
    IssuesRepo: await duckRepo({mongo}, issuesCrud, IssuesSchema),
    AddressesRepo: await duckRepo({mongo}, addressesCrud, AddressesSchema),
    CompaniesRepo: await duckRepo({mongo}, companiesCrud, CompanySchema),
    BrandsRepo: await duckRepo({mongo}, brandsCrud, BrandSchema),
})