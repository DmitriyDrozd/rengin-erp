import {SagaOptions} from './sagaOptions';
import {SEServiceState} from './store/serviceDuck';
import {ServiceStore} from "./store/configureServiceStore";

declare module 'fastify' {
    interface FastifyInstance {
        io: SagaOptions
    }
    interface FastifyRequest {
        state: SEServiceState
        io: SagaOptions
        store: ServiceStore
    }
}
