import {FastifyInstance, FastifyPluginAsync} from 'fastify'
import Path from 'path';
import {BRANDS, ORMState, TICKETS, TicketVO} from "iso";
import '@fastify/multipart'
import * as XLSX from "xlsx";
import dayjs from "dayjs";
import * as R from "ramda";
import {allIssuesFolder, ensureMoved, exportIssuesZip} from "../export-issues-zip";
import moment from "moment/moment";
import {AnyAttr} from "@shammasov/mydux";
import {ServerContext} from "../../store/configureServerStore";
const fs = require('node:fs')
const util = require('node:util')
const { pipeline } = require('node:stream')
const pump = util.promisify(pipeline)


export const uploadRaw: FastifyPluginAsync<ServerContext> = (fastify: FastifyInstance, opts: ServerContext) => {

    const store = opts.store

    fastify.post('/api/upload/:issueId', async function (req, reply) {
        const state = store.getState()
        // process a single file
        // also, consider that if you allow to upload multiple files
        // you must consume all files otherwise the promise will never fulfill
        const data = await req.file()

        if(data) {
            data.file // stream
            data.fields // other parsed parts
            data.fieldname
            data.filename
            data.encoding
            data.mimetype
            // @ts-ignore
            const issueId = req.params.issueId
            const issue = TICKETS.selectors.selectById(issueId)(state)
            const brand = BRANDS.selectors.selectById(issue.brandId!)(state)
            // to accumulate the file in memory! Be careful!
            //
            // await data.toBuffer() // Buffer
            //
            // or
            var dir = Path.join('..', 'static', 'uploads', 'issues', brand.brandName + '_' + issue.clientsIssueNumber)

            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, {recursive: true});
            }
            const p = Path.join(dir, data.filename)
            await pump(data.file, fs.createWriteStream(p))

            // be careful of permission issues on disk and not overwrite
            // sensitive files that could cause security risks

            // also, consider that if the file stream is not consumed, the promise will never fulfill

            return reply.send({
                url: '/uploads/issues/' + issueId + '/' + data.filename
            })
        }
        return  reply.send("NoData")
    })

    fastify.post<{Querystring: {email: string,images: string }}>('/api/email-export',
        async function (request, reply) {
            let {email, images} = request.query
            email = 'miramaxis@ya.ru'
            const data = await request.file()

            if(data) {
                data.file // stream
                data.fields // other parsed parts
                data.fieldname
                data.filename
                data.encoding
                data.mimetype
                const buffer = await data.toBuffer()
                var workbook = XLSX.read(buffer,{type:'buffer'})
                const worksheet = workbook!.Sheets[workbook.SheetNames[0]]
                 const publicDir = Path.join(__filename,'..','..','..','..','static')
                var dir = Path.join(publicDir, 'reports',  dayjs().format('YYYY-MM-DD_HH-mm-ss'))

                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir, {recursive: true});
                }
                const p = Path.join(dir, data.filename)
                fs.writeFileSync(p,buffer,{ })
                //     await pump(data.file, fs.createWriteStream(p))

                var json = XLSX.utils.sheet_to_json<any>(worksheet);
                var issues: TicketVO[] = json.map( obj => {
                        const is: TicketVO = {} as any

                        Object.values(TICKETS.attributes).forEach( (p: AnyAttr) => {
                            if (p.headerName in obj){
                                is[p.name] = obj[p.headerName]
                            }
                        })
                        return is
                    }
                )
                const ids = issues.map(R.prop('issueId'))

                const state =store.getState() as ORMState
                const issuesFromState = TICKETS.selectors.selectAll(state)
                    .filter(i => ids.includes(i.id))
                for(let i of issuesFromState)
                    await ensureMoved(allIssuesFolder+'\\'+i.id, allIssuesFolder+'\\'+BRANDS.selectors.selectById(i.brandId!)(state).brandName + '_' + i.clientsIssueNumber)
                const dateSuffix = moment().format('YYYY-MM-DD HH:mm')
                const relativeZipPath = await exportIssuesZip(p, state, issuesFromState, email!,'RenginDesk Выгрузка заявок')

                //const buff = await zip.toBufferPromise()
                // const stream = fs.createReadStream(fullZipPath, 'utf8')
              return  reply.send({url:relativeZipPath})//.headers({'Content-Disposition': 'attachment; filename="REFERRALS.zip"', 'Content-Type':'application/zip', 'Content-Length':buff.length}).send(buff)//await zip.toBufferPromise())
                //return reply.header('Content-Disposition', 'attachment; filename="REFERRALS.xlsx"')
               //.send(stream)
              //  return reply.sendFile(fullZipPath)//.send(bufferZip)

            }
            return  reply.send("NoData")
        }
    )

}
