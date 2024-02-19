import {FastifyInstance, FastifyPluginAsync, FastifyRequest} from 'fastify';
import zlib from 'zlib'
import {Store} from "@reduxjs/toolkit"
import {bootstrapAction, SSE_REDUX_EVENT, StateWithSlice} from "@shammasov/mydux";
import {getAllSSESessionsChannel, getSSEAdminChannel} from "./sse-channels";

import {SSESessionState, startSSESession} from "./startSSESession";
import {sessionsSlice} from "./sessionsSlice";
import {SSESession} from "./common";
import {generateGuid} from "@shammasov/utils";

export type StoreWithSSESessions = Store<StateWithSlice<typeof sessionsSlice>>
export type SSESessionsRouterProps = {
    store: StoreWithSSESessions,
    getUserIdByRequest?: (req: FastifyRequest<{Querystring: {userId:string}}>) => string,
    selectBootstrapByUserID?: (state: any, userId: string) => any
}

const defaultGetUserIdByRequest = (req: FastifyRequest<{Querystring: {userId:string}}>) => req.query.userId

export const sseSessionsPlugin: FastifyPluginAsync<SSESessionsRouterProps> =  async (
    fastify: FastifyInstance,
    {
        store,
        selectBootstrapByUserID = (state, userId: any) => state,
        getUserIdByRequest = defaultGetUserIdByRequest
    }: SSESessionsRouterProps) => {

    const brotliCompress = async (str: string) => {
        return new Promise( (res, rej) => zlib.brotliCompress(str , {params:{
                [zlib.constants.BROTLI_PARAM_MODE]: zlib.constants.BROTLI_MODE_TEXT,
                [zlib.constants.BROTLI_PARAM_QUALITY]: 4,
                [zlib.constants.BROTLI_PARAM_SIZE_HINT]: str.length,
            }}, (err, buffer) => {
            if(err)
                rej(err)
            res(buffer)
        }))
    }
    fastify.get( '/api/full-state',
       async (request, reply) => {

            const credentials = request.body
            const store = fastify.store
            const state = store.getState()
            const data = state
            return await reply.header("content-encoding", 'br').send(await brotliCompress(JSON.stringify(data)))

        }
    )


    fastify.post('/api/push-commands',
        async (request, reply) => {

            let events: any = request.body
            if (events['events'])
                events = events['events']

            if(events && events[0])
            return reply.send(store.dispatch(events[0]))

            return reply.status(400).send({Error:'No events sent'})
        }
    )

        fastify.get<{Querystring:{userId: string, storeGuid: string}}>('/api/sse/find',
            async (request, reply) => {

                const userId = getUserIdByRequest(request)
                if(!userId)
                  return  reply.status(403).send({"Error":'Unauthorized'})
                const params = {storeGuid: generateGuid(), userId}
                reply.redirect('/api/sse/channel?'+ new URLSearchParams(params))
            }
        )

        fastify.get<{Querystring:{userId: string, storeGuid: string}}>(
            '/api/sse/channel',
         async (request, reply) => {
             const userId = getUserIdByRequest(request)
             if(!userId)
                 return  reply.status(403).send({"Error":'Unauthorized'})
                const state = fastify.store.getState()
                const { storeGuid} = request.query as { [key in string]: string }

                const sessionState = {userId, storeGuid}
                const sseSession = await startSSESession(request.raw, reply.raw, sessionState)
                const boot = selectBootstrapByUserID(state, userId)
                sseSession.push(bootstrapAction({...boot,
                    connection: {preloaded: true},
                    dispatcher: {userId, storeGuid,grade:'user'}
                }),SSE_REDUX_EVENT)

            }
        )
        fastify.get<{Querystring:{userId: string, storeGuid: string}}>(
            '/api/sse/admin',
            async (request, reply) => {
            const state = fastify.store.getState()
                const userId = getUserIdByRequest(request)
                if(!userId)
                    return  reply.status(403).send({"Error":'Unauthorized'})
            const {storeGuid} = request.query as { [key in string]: string }
            const sseSession = await startSSESession(request.raw, reply.raw, {
                userId,
                storeGuid,
                headers: request.headers,
                ip: request.ip
            })

            const channel = getSSEAdminChannel('admin')
            channel.register(sseSession)
            sseSession.push(bootstrapAction({...state,
                sse: {preloaded: true, userId, storeGuid},
                actor: {userId, storeGuid,grade:'admin'}
            }),SSE_REDUX_EVENT)
        }
    )
    const sessionRegistered = (session: SSESession<SSESessionState>) => {
        store.dispatch(sessionsSlice.actions.added({
            sessionId: session.state.storeGuid,
            userId: session.state.userId,
            ip: session.state.ip,

        }))
    }
    const sessionDeregistered = (session: SSESession<SSESessionState>) => {
        store.dispatch(sessionsSlice.actions.removed(session.state.storeGuid))
    }
    getAllSSESessionsChannel().addListener('session-registered', sessionRegistered)
    getAllSSESessionsChannel().addListener('session-deregistered', sessionDeregistered)


}
