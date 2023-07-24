import path from 'path'
import Fastify from 'fastify'
import {SagaOptions} from '../sagaOptions'
import fastifyStatic from '@fastify/static'
import fp from 'fastify-plugin'
import usersDataPlugin from './data-users/data-users-routes-plugin'
import fastifyPrettier from 'fastify-prettier'
import configDuck from "iso/src/store/bootstrap/configDuck";
import  br from 'brotli'

const events = {}
const _importDynamic = new Function("modulePath", "return import(modulePath)")
import fastify, {FastifyLoggerOptions, RawServerBase} from 'fastify'
import {PinoLoggerOptions} from 'fastify/types/logger'

import {DateTime,} from 'luxon'

let requestHandler = null;


export type FastifyHTTPErrorsEnhanced = typeof import("fastify-http-errors-enhanced"); // This is the import type!

export const  loadFastifyHttpError = async (): Promise<FastifyHTTPErrorsEnhanced> => {
    // ...
    return await _importDynamic("fastify-http-errors-enhanced")

}


let FastifyHTTPErrorsEnhanced: FastifyHTTPErrorsEnhanced = {} as any
const root = path.join(__dirname, '..', '..', '..', 'static')

export default async (io: SagaOptions) => {
    const state = io.store.getState()
    const config = configDuck.selectConfig(state)
    const logger: boolean | FastifyLoggerOptions<RawServerBase> & PinoLoggerOptions = {

        genReqId: (req) =>
            req.url+ '@'+DateTime.now().toFormat('HH mm ss'),


        serializers: {
            req: request => {
                return {
                    //  method: request.method,
                    //  proto: request.protocol,
                    path: request.routerPath,
                    body: request.body,
                    // Including the headers in the log could be in violation
                    // of privacy laws, e.g. GDPR. You should use the "redact" option to
                    // remove sensitive fields. It could also leak authentication data in
                    // the logs.
                    //headers: request.headers
                };
            }
        }
    }

    let fastify = Fastify({   logger,
        ignoreTrailingSlash: true,
        bodyLimit: 1048576 * 4,

        trustProxy: true,
        // ?modifyCoreObjects:false"
    });
    FastifyHTTPErrorsEnhanced = await loadFastifyHttpError()




    fastify.register(FastifyHTTPErrorsEnhanced.default, {
        hideUnhandledErrors: false
    })

    fastify.register(require('@fastify/cors'),{origin: false, allowedHeaders: '*'})

     //fastify.register(fastifyCompress,{zlibOptions:{level:3}})


    fastify.register(fastifyStatic, {
        root,
    })
    fastify.get('/app*', async (req, reply) => {

        return reply.sendFile('index.html')
    })
    const fastifyPrintRoutes = await _importDynamic('fastify-print-routes')
    fastify.register(fastifyPrintRoutes)


    fastify.register(fp((fastify, opts, done) => {
        fastify.decorate('io', io)
        fastify.addHook('onRequest', (req, reply, next) => {
            req.state = fastify.io.store.getState()
            req.io = fastify.io
            next()
        })
        done()
    }))

    const ssePlugin = await import('./sse/index')
    fastify.register(fp(ssePlugin.default))

    fastify.register(fp(usersDataPlugin))
    return fastify
}



