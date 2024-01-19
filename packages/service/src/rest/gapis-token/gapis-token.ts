import {FastifyInstance} from 'fastify'
import path from 'path';
import {ISSUES} from "iso/src/store/bootstrap";
import BRANDS from "iso/src/store/bootstrap/repos/brands";
import '@fastify/multipart'
import moment from "moment/moment";
import {Auth} from "googleapis";
import {G_SCOPES} from "./import-issues";
const contentDisposition = require('content-disposition');
const fs = require('node:fs')

const util = require('node:util')
const { pipeline } = require('node:stream')
const pump = util.promisify(pipeline)
export const getGAuth = async () =>
    await new Auth.GoogleAuth({
        keyFile:'./src/rest/gapis-token/rengindesk-377517-7cc80b9e8d57.json',
        clientOptions:{lifetime: 3600*12},
        scopes:G_SCOPES,
    })

export default async (fastify: FastifyInstance, opts: any, done: Function) => {
    const auth = await getGAuth()
    fastify.get('/api/gapis/get-token',
        async (request, reply) => {
            return reply.headers({"Cache-Control": "no-store",
                Pragma: "no-cache",}).send({token:await (await getGAuth()).getAccessToken()})
        })

    await done()
}
