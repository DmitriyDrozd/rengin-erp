import {FastifyInstance} from 'fastify'

import getSSEUserChannel from './getSSEUserChannel';
import broadcastSSEEventsSaga from './broadcastSSEEventsSaga';
import createSSESession, {SSESessionState} from './createSSESession';
import getSSEAdminChannel from './getSSEAdminChannel';
import getSSEAllSesionsChannel from './getSSEAllSesionsChannel';

import {sessionsDuck} from './sessionsDuck';
import '../../fastify-with-plugins'

export default async (fastify: FastifyInstance, opts, done) => {
    const io = fastify.io
    const events = []
    const stripeSessions = {}
    fastify.io.store.runSaga(broadcastSSEEventsSaga)
    fastify.route({
        method: 'GET',
        url: '/api/sse/user',
        schema: {
            querystring: {
                userId: {type: 'string'},
                storeGuid: {type: 'string'}
            },
        },
        handler: async (request, reply) => {
            const state = fastify.io.store.getState()
            const {userId, storeGuid} = request.query as { [key in string]: string }
            const sseSession = await createSSESession(request.raw, reply.raw, {userId, storeGuid})
            getSSEUserChannel(userId).register(sseSession)
        }
    })
    fastify.route({
        method: 'GET',
        url: '/api/sse/admin',
        schema: {
            querystring: {
                userId: {type: 'string'},
                storeGuid: {type: 'string'}
            },
        },
        handler: async (request, reply) => {
            const state = fastify.io.store.getState()
            const {userId, storeGuid} = request.query as { [key in string]: string }
            const sseSession = await createSSESession(request.raw, reply.raw, {
                userId,
                storeGuid,
                headers: request.headers,
                id: request.ip
            })

            const channel = getSSEAdminChannel('admin')
            channel.broadcast('wow', {media: 'true'})
            channel.register(sseSession)
        }
    })
    const sessionRegistered = (session: Session<SSESessionState>) => {
        const user = USERS.selectById(session.state.userId)(io.store.getState())
        io.store.dispatch(sessionsDuck.actions.added({
            sessionId: session.state.storeGuid,
            email: user ? user.email : session.state.userId, ...session.state
        }))
    }
    const sessionDeregistered = (session: Session<SSESessionState>) => {
        io.store.dispatch(sessionsDuck.actions.removed(session.state.storeGuid))
    }
    getSSEAllSesionsChannel().addListener('session-registered', sessionRegistered)
    getSSEAllSesionsChannel().addListener('session-deregistered', sessionDeregistered)
    done()
}
