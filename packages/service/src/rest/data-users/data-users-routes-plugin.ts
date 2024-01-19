import {FastifyInstance} from 'fastify'
import zlib from 'zlib'
import USERS from 'iso/src/store/bootstrap/repos/users'

export default async (fastify: FastifyInstance, opts: any, done: Function) => {
    const store = fastify.io.store
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
    fastify.route({
        method: 'GET',
        url: '/api/full-state',

        handler: async (request, reply) => {
            const credentials = request.body
            const io = fastify.io
            const state = io.store.getState()
            const data = state
            return await reply.header("content-encoding", 'br').send(await brotliCompress(JSON.stringify(data)))

        }
    })





    fastify.route({
        method: 'POST',
        url: '/api/bootstrap',
        schema: {
            body: {
                email: {type: 'string'},
                password: {type: 'string'},
            },
        },

        handler: async (request, reply) => {
            const credentials = request.body as any
            const {email, password} = credentials
            if (!credentials.email || !credentials.password)
                throw new Error('not valid email password pairs')
            const io = fastify.io
            const state = io.store.getState()
            const user = USERS.selectUserByCredentials(credentials)(state)

            if (!user)
                throw new Error('user not found')

            return {
                bootstrap: state.app.bootstrap,
                login: {
                    value: {
                        email,
                        password,
                        // godMode: godPassword === credentials.password ? true : false
                    },
                    params: {
                        email,
                        password
                    },
                    status: 'done',
                }
            }

        }
    })

    fastify.route({
        method: 'POST',
        url: '/api/user/login',
        schema: {
            body: {
                email: {type: 'string'},
                password: {type: 'string'},

            },
        },
        handler: async (request, reply) => {
            const credentials = request.body as any
            const {email, password} = credentials
            if (!credentials.email || !credentials.password)
                throw new Error('not valid email password pairs')
            const io = fastify.io
            const state = io.store.getState()
            const user = USERS.selectUserByCredentials(credentials)(state)

            if (!user)
                throw new Error('user not found')

            return user
        }
    })

    fastify.route({
        method: 'POST',
        url: '/api/push-commands',
        handler: async (request, reply) => {
            const io = fastify.io
            let events = request.body as any
            if (events['events'])
                events = events['events']
            if (events[0].type !== 'users/register_STARTED')
                io.store.dispatch(events[0])

            return USERS.selectById(events[0].userId)(io.store.getState()) || true
        }
    })


    done()
}
