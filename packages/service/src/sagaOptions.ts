import {ServiceStore} from "./store/configureServiceStore";
import {FastifyInstance} from "fastify";
import {UnPromisify} from "@sha/utils";
import eventStore from "./repositories/eventStore";
import duckRepo from "./repositories/duckRepo";
import {addressesCrud, contractsCrud, issuesCrud, usersCrud} from 'iso/src/store/bootstrap';
import {IssuesSchema} from "iso/src/store/bootstrap/repos/Issues-schema";
import {UserSchema} from "iso/src/store/bootstrap/repos/user-schema";
import {ContractsSchema} from 'iso/src/store/bootstrap/repos/contracts-schema'
import {AddressesSchema} from 'iso/src/store/bootstrap/repos/addresses-schema'
import {Duck} from '@sha/fsa/src/createBootableDuck'
import {Crud} from '@sha/fsa/src/createCRUDDuck'
import bootstrapRepositories from './repositories/bootstrapRepositories'


type ThenArg<T> = T extends Promise<infer U> ? U :
    T extends ((...args: any[]) => Promise<infer V>) ? V :
        T

export type SagaOptions = UnPromisify<ReturnType<typeof sagaOptions>>
type ReposMapByBootstrapCruds<Type extends {[key in string]: Crud<any>}> = {
    [Property in keyof Type]: Type[Property]['reducer'];
};

export const sagaOptions = async (store: ServiceStore, mongo, gServices) => {


    const repos = await bootstrapRepositories(mongo)
    const options = {
        logger: console,
        fastify: undefined as FastifyInstance,
        store,
        tgBotSend: console.info,
        mongo,
        gServices,

        eventStore: await eventStore(mongo),
 ...repos,repos
    }


    return {
        ...options,

    }
}

export default sagaOptions
