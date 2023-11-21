import {SagaOptions} from './sagaOptions';
import {SEServiceState} from './store/serviceDuck';

declare module 'fastify' {
    interface FastifyInstance {
        io: SagaOptions
    }

    interface FastifyRequest {
        state: SEServiceState
    }
}
