import {FastifyInstance, FastifyPluginAsync, FastifyPluginOptions} from 'fastify';
import '@fastify/multipart';
import {Auth} from 'googleapis';
import fp from "fastify-plugin";

export const G_SCOPES = [
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/youtube',
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/gmail.send',
];

export const getGAuth = async () =>
     new Auth.GoogleAuth({
        keyFile: './src/fastify/gapis-token/rengindesk-377517-7cc80b9e8d57.json',
        clientOptions: { lifetime: 3600 * 12 },
        scopes: G_SCOPES,
    });

const gsapiTokenRaw: FastifyPluginAsync<FastifyPluginOptions> =  async (fastify: FastifyInstance, opts: FastifyPluginOptions) => {
    const gAuth = await getGAuth();
    fastify.get('/api/gapis/get-token', async (request, reply) => {
        return reply.headers({
            'Cache-Control': 'no-store',
            Pragma: 'no-cache',
        }).send({ token: await (await getGAuth()).getAccessToken() });
    });

};

export const gsapiTokenPlugin = fp(gsapiTokenRaw)