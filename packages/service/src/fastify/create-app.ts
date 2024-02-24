import * as path from 'path'
import {Store} from '@reduxjs/toolkit'
import Fastify, {FastifyLoggerOptions, FastifyRequest, RawServerBase} from 'fastify'
import fastifyStatic from '@fastify/static'
import {PinoLoggerOptions} from 'fastify/types/logger'
import fastifyPrettier from 'fastify-prettier'
import {DateTime} from 'luxon'
import {uploadPlugin} from './upload'
import {gsapiTokenPlugin} from './gapis-token/gapis-token'
import {ServerContext} from '../store/buildServerStore'
import {sessionsSlice, sseSessionsPlugin} from '@shammasov/mydux-backend'
import {authPlugin} from './auth/auth-plugin'
import {StateWithSlice} from '@shammasov/mydux'
import './../typings'
import {propOr} from 'ramda'
import {fastifyErrors, fastifyHttpErrorsPromise} from '../errors'

const events = {}

export const createApp = async (ctx: ServerContext) => {

    const root = path.join(__dirname, '..', '..', '..', 'static')

    const logger: boolean | FastifyLoggerOptions<RawServerBase> & PinoLoggerOptions = {

        enabled: true,
        timestamp: true,
        genReqId: (req) =>
            req.url+ '@'+DateTime.now().toFormat('HH mm ss'),

        serializers: {
            req: request => {
                return {
                    path: request.routeOptions.url,
                    body: request.body,
                };
            }
        }
    }
    await fastifyHttpErrorsPromise
    let fastify = Fastify({
logger,
        ignoreTrailingSlash: true,
        bodyLimit: 1048576 * 10,
        trustProxy: true,
        // ?modifyCoreObjects:false"
    })
    fastify.register(  fastifyPrettier,
        {

            fallbackOnError: false
        })
    fastify.register(fastifyErrors,{hideUnhandledErrors: false})

    fastify.decorateRequest('store', {getter: () => ctx.store})
        .decorateRequest('state', null )
        .addHook('preHandler', (request: FastifyRequest, _reply, done) => {
            request.state = ctx.store.getState();
            done();
        })
        .decorate('store', {getter: () => ctx.store})
    //await fastifyHttpErrorsPromise
   // await fastify.register(fastifyErrors, { hideUnhandledErrors: false, })
    /*  fastify.register(FastifyHTTPErrorsEnhanced.default, {
           hideUnhandledErrors: false
       })*/


    fastify.register(require('@fastify/multipart'))

    fastify.register(require('@fastify/cors'),{origin: false, allowedHeaders: '*'})

    await fastify.register(fastifyStatic, {root,})


    fastify.get('/app*', async (req, reply) => {
        return reply.sendFile('index.html')
    })

    fastify.get('/uploads/*', async(req, reply)=> {
        return reply.sendFile(req.raw.url!)
    })

    fastify.register(authPlugin)

    await fastify.register(sseSessionsPlugin,{
        store: ctx.store as any as Store<StateWithSlice<typeof sessionsSlice>>,
        getUserIdByRequest: (request:FastifyRequest) => {
            return propOr(undefined,'id', request.user)
        },
    })
    fastify.register(uploadPlugin)
    fastify.register(gsapiTokenPlugin)

    return fastify
}



