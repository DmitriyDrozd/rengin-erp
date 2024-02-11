import {Store} from "@reduxjs/toolkit"

declare module 'fastify' {
    interface FastifyInstance {
        store: Store
    }
}