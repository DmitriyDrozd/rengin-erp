import Fastify, {FastifyLoggerOptions, RawServerBase} from 'fastify'
import {SagaOptions} from '../sagaOptions'
import fastifyStatic from '@fastify/static'
import fp from 'fastify-plugin'
import usersDataPlugin from './data-users/data-users-routes-plugin'
import configDuck from 'iso/src/store/bootstrap/configDuck';
import {PinoLoggerOptions} from 'fastify/types/logger';

import {DateTime,} from 'luxon'
import upload from "./upload";
import backup from "./backup";
import gapisToken from "./gapis-token/gapis-token";
import { getStaticPath } from './utils/pathUtils';

const events = {}
const _importDynamic = new Function("modulePath", "return import(modulePath)")

export type FastifyHTTPErrorsEnhanced = typeof import("fastify-http-errors-enhanced");

export const  loadFastifyHttpError = async (): Promise<FastifyHTTPErrorsEnhanced> => {
    return await _importDynamic("fastify-http-errors-enhanced")
}


let FastifyHTTPErrorsEnhanced: FastifyHTTPErrorsEnhanced = {} as any

const staticPath = getStaticPath();

export default async (io: SagaOptions) => {
    const state = io.store.getState()
    const store = io.store
    const config = configDuck.selectConfig(state)
    const logger: boolean | FastifyLoggerOptions<RawServerBase> & PinoLoggerOptions = {

        genReqId: (req) =>
            req.url+ '@'+DateTime.now().toFormat('HH mm ss'),

        serializers: {
            req: request => {
                return {
                    //  method: request.method,
                    //  proto: request.protocol,
                    path: request.routeOptions.url,
                    body: request.body,
                    // You should use the "redact" option to
                    // remove sensitive fields. It could also leak authentication data in
                    // the logs.
                    //headers: request.headers
                };
            }
        }
    }

    let fastify = Fastify({
        logger,
        ignoreTrailingSlash: true,
        bodyLimit: 1048576 * 4,
        trustProxy: true,
        // ?modifyCoreObjects:false"
    });
    FastifyHTTPErrorsEnhanced = await loadFastifyHttpError()



    fastify.register(require('@fastify/multipart'))
    fastify.register(FastifyHTTPErrorsEnhanced.default, {
        hideUnhandledErrors: false
    })

    fastify.register(require('@fastify/cors'),{origin: false, allowedHeaders: '*'})

     //fastify.register(fastifyCompress,{zlibOptions:{level:3}})


    fastify.register(fastifyStatic, {
        root: staticPath,
    })

    fastify.get('/app*', async (req, reply) => {

        return reply.sendFile('index.html')
    })
    fastify.get('/uploads/*', async(req, reply)=> {
        return reply.sendFile(req.raw.url!)
    })
    fastify.get('/archives/*', async(req, reply)=> {
        return reply.sendFile(req.raw.url!)
    })
    fastify.get('/backup/*', async(req, reply)=> {
        return reply.sendFile(req.raw.url!)
    })


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
    fastify.register(upload)
    fastify.register(backup)
    fastify.register(fp(gapisToken))

    return fastify
}



