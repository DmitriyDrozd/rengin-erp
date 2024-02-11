import * as path from 'path'
import {Store} from '@reduxjs/toolkit'
import Fastify, {FastifyLoggerOptions, RawServerBase} from 'fastify'
import fastifyStatic from '@fastify/static'
import fp from 'fastify-plugin'
import {PinoLoggerOptions} from 'fastify/types/logger'

import {DateTime,} from 'luxon'
import upload from "./routes/upload";
import {gsapiTokenPlugin} from "./gapis-token/gapis-token";
import {ServerContext, ServerContextParts, ServerStore} from "../store/configureServerStore";
import {sseSessionsPlugin,sessionsSlice} from "@shammasov/mydux-backend";
import {USERS} from "iso";
import {authPlugin} from "./auth/auth-plugin";
import {StateWithSlice} from "@shammasov/mydux";

const events = {}
const _importDynamic = new Function("modulePath", "return import(modulePath)")

export type FastifyHTTPErrorsEnhanced = typeof import("fastify-http-errors-enhanced"); // This is the import type!

export const  loadFastifyHttpError = async (): Promise<FastifyHTTPErrorsEnhanced> => {
    return await _importDynamic("fastify-http-errors-enhanced")
}


let FastifyHTTPErrorsEnhanced: FastifyHTTPErrorsEnhanced = {} as any

export const createApp = async (ctx: ServerContext) => {

    const root = path.join(__dirname, '..', '..', '..', 'static')

    const logger: boolean | FastifyLoggerOptions<RawServerBase> & PinoLoggerOptions = {

        genReqId: (req) =>
            req.url+ '@'+DateTime.now().toFormat('HH mm ss'),

        serializers: {
            req: request => {
                return {
                    path: request.routerPath,
                    body: request.body,
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

    await fastify.register(fastifyStatic, {
        root,
    })

    await fastify.register(sseSessionsPlugin,{
        store: ctx.store as any as Store<StateWithSlice<typeof sessionsSlice>>,
        getUserIdByRequest: (request) => {
            return request.query.userId
        },
    })

    fastify.get('/app*', async (req, reply) => {

        return reply.sendFile('index.html')
    })
    fastify.get('/uploads/*', async(req, reply)=> {
        return reply.sendFile(req.raw.url!)
    })



    fastify.register(fp(authPlugin))
    fastify.register(upload)
    fastify.register(fp(gsapiTokenPlugin))

    return fastify
}



