import {ServiceStore} from './store/configureServiceStore';
import {FastifyInstance} from 'fastify';
import {UnPromisify} from '@sha/utils';
import eventStore from './repositories/eventStore';
import {Crud} from '@sha/fsa/src/createCRUDDuck'


type ThenArg<T> = T extends Promise<infer U> ? U :
    T extends ((...args: any[]) => Promise<infer V>) ? V :
        T

export type SagaOptions = UnPromisify<ReturnType<typeof sagaOptions>>
type ReposMapByBootstrapCruds<Type extends {[key in string]: Crud<any>}> = {
    [Property in keyof Type]: Type[Property]['reducer'];
};

export const sagaOptions = async (store: ServiceStore, EventRepo: ReturnType<typeof eventStore>) => {

    const {pg,mongo,runSaga,gServices,} =store

    const options = {
        logger: console,
        fastify: undefined as FastifyInstance,
        store,
        tgBotSend: console.info,
        mongo,
        gServices,
        pg,
        EventRepo: EventRepo,
    }


    return {
        ...options,

    }
}

export default sagaOptions
