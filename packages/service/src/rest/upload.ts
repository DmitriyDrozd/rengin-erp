import {FastifyInstance} from 'fastify'
import path from 'path';
const fs = require('node:fs')

const util = require('node:util')
const { pipeline } = require('node:stream')
const pump = util.promisify(pipeline)

export default (fastify: FastifyInstance, opts, done) => {

    fastify.register(require('@fastify/multipart'))

    const io = fastify.io
    fastify.post('/api/upload/:issueId', async function (req, reply) {
        const issueId = req.params.issueId
        // process a single file
        // also, consider that if you allow to upload multiple files
        // you must consume all files otherwise the promise will never fulfill
        const data = await req.file()

        data.file // stream
        data.fields // other parsed parts
        data.fieldname
        data.filename
        data.encoding
        data.mimetype

        // to accumulate the file in memory! Be careful!
        //
        // await data.toBuffer() // Buffer
        //
        // or
        var dir =  path.join('..','static','uploads', 'issues',issueId)

        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir, { recursive: true });
        }
        const p = path.join(dir,data.filename)
        await pump(data.file, fs.createWriteStream(p))

        // be careful of permission issues on disk and not overwrite
        // sensitive files that could cause security risks

        // also, consider that if the file stream is not consumed, the promise will never fulfill

        return reply.send({
            url:'/uploads/issues/'+issueId+'/'+data.filename
        })
    })
    done()
}
