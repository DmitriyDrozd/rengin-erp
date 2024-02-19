import {ServerState, ServerStore} from "./store/buildServerStore";

declare module 'fastify' {

    interface FastifyInstance {
        store: ServerStore
    }
    interface FastifyRequest {
        store:ServerStore
        state:ServerState
    }
}
