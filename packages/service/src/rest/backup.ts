import { FastifyInstance } from 'fastify';
import {
    exportBackup,
    getBackupFolderNames,
    importBackup
} from './data-users/backup';

export default (fastify: FastifyInstance, opts: any, done: Function) => {
    fastify.get('/api/backup-folders',
        async function (request, reply) {
            reply.send(getBackupFolderNames());
        }
    )

    fastify.post('/api/backup-create', async function (request, reply) {
        const path = exportBackup();

        reply.send({ url: path });
    })

    fastify.post('/api/backup-restore', async function (request, reply) {
        const data = request.body as { folderName?: string, file: any };
        importBackup(data);

        reply.code(200);
    })

    done()
}