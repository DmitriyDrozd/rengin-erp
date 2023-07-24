import {FastifyInstance} from 'fastify'
import {usersCrud} from 'iso/src/store/bootstrap';
import sheetsDuck from "iso/src/store/bootstrap/sheetsDuck";
import {put, take} from "typed-redux-saga";

export default async (fastify: FastifyInstance, opts, done) => {

    const store = fastify.io.store
    const sheets =
    fastify.route({
        method: 'GET',
        url: '/api/sheets/state',

        handler: async (request, reply) => {
            const credentials = request.body
            const io = fastify.io
            const state = io.store.getState()
            return state.app.bootstrap.sheets
        }
    })
    fastify.route({
        method: 'GET',
        url: '/api/sheets/bootstrap',

        handler: async (request, reply) => {
            const credentials = request.body
            const io = fastify.io
            const state = io.store.getState()
            const {users, settings} = state.app.bootstrap
            return {
                users,
                settings,
            }
        }
    })
        fastify.route({
            method: 'POST',
            url: '/api/sheets-edit-updated',
            handler: async (request, reply) => {
                const io = fastify.io
                const sheets = request.body
                console.log(sheets)
                io.store.dispatch(sheetsDuck.actions.editUpdated({sheets,timeISO: new Date().toISOString()}))


                return {ok: true}
            }
        })
    fastify.route({
        method: ['POST', 'GET'],
        url: '/api/sheets-edit-notified',
        handler: async (request, reply) => {
            const io = fastify.io
            const action = sheetsDuck.actions.editNotified({})

            console.log('awaiting for a promise')

            io.store.dispatch(action)

            return {ok: true}
        }
    })


    done()
}
