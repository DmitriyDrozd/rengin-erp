import {FastifyInstance} from 'fastify'
import path from 'path';
import {ISSUES} from "iso/src/store/bootstrap";
import BRANDS from "iso/src/store/bootstrap/repos/brands";
import '@fastify/multipart'
import * as XLSX from "xlsx";
import dayjs from "dayjs";
import {IssueVO} from "iso/src/store/bootstrap/repos/issues";
import {AnyMeta} from "iso/src/store/bootstrap/core/valueTypes";
import * as R from "ramda";
import {ISOState} from "iso/src/ISOState";
import {
    exportIssuesArchive,
    TIssueFileType
} from './data-users/export-issues-archive';
import {allIssuesFolder, exportIssuesZip} from "./data-users/export-issues-zip";
// import moment from "moment/moment";
import { ensureMoved } from './utils/fileUtils';
const fs = require('node:fs')

const util = require('node:util')
const { pipeline } = require('node:stream')
const pump = util.promisify(pipeline)


export default (fastify: FastifyInstance, opts: any, done: Function) => {
    // const io = fastify.io
    fastify.post('/api/upload/:issueId', async function (req, reply) {

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
            const issue = ISSUES.selectById(issueId)(req.state)
            const brand = BRANDS.selectById(issue.brandId!)(req.state)
            // to accumulate the file in memory! Be careful!
            //
            // await data.toBuffer() // Buffer
            //
            // or
            var dir = path.join('..', 'static', 'uploads', 'issues', brand.brandName + '_' + issue.clientsIssueNumber)

            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, {recursive: true});
            }
            const p = path.join(dir, data.filename)
            await pump(data.file, fs.createWriteStream(p))

            // be careful of permission issues on disk and not overwrite
            // sensitive files that could cause security risks

            // also, consider that if the file stream is not consumed, the promise will never fulfill

            return reply.send({
                url: '/uploads/issues/' + brand.brandName + '_' + issue.clientsIssueNumber + '/' + data.filename
            })
        }
        return  reply.send("NoData")
    })

    fastify.post('/api/email-export',
        async function (request, reply) {
            // let {email, images} = request.query;
            const email = 'miramaxis@ya.ru';
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
                const publicDir = path.join(__filename,'..','..','..','..','static')
                var dir = path.join(publicDir, 'reports',  dayjs().format('YYYY-MM-DD_HH-mm-ss'))

                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir, {recursive: true});
                }
                const p = path.join(dir, data.filename)
                fs.writeFileSync(p,buffer,{ })
                //     await pump(data.file, fs.createWriteStream(p))

                var json = XLSX.utils.sheet_to_json(worksheet);
                var issues: IssueVO[] = json.map(obj => {
                        const is: IssueVO = {} as any

                        Object.values(ISSUES.properties).forEach( (p: AnyMeta) => {
                            if (p.headerName in obj){
                                is[p.name] = obj[p.headerName]
                            }
                        })
                        return is
                    }
                )
                const ids = issues.map(R.prop('issueId'))

                const state =request.io.store.getState() as ISOState
                const issuesFromState = ISSUES.selectAll(state)
                    .filter(i => ids.includes(i.issueId))
                for(let i of issuesFromState)
                    await ensureMoved(allIssuesFolder+'\\'+i.issueId, allIssuesFolder+'\\'+BRANDS.selectById(i.brandId!)(state).brandName + '_' + i.clientsIssueNumber)
                // const dateSuffix = moment().format('YYYY-MM-DD HH:mm')
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

    fastify.post('/api/archive-export',
        async function (request, reply) {
            const data = request.body as { selected: string[], types: TIssueFileType[] };

            if (data) {
                const selectedIDs = data.selected;
                const selectedTypes = data.types;
                const state = request.io.store.getState() as ISOState;
                const issuesFromState = ISSUES
                    .selectAll(state)
                    .filter(i => selectedIDs.includes(i.issueId));

                for (const item of issuesFromState) {
                    await ensureMoved(
                        allIssuesFolder+'\\'+item.issueId,
                        allIssuesFolder+'\\'+BRANDS.selectById(item.brandId!)(state).brandName + '_' + item.clientsIssueNumber
                    );
                }

                const relativeZipPath = await exportIssuesArchive(state, issuesFromState, selectedTypes);
                return reply.send({ url: relativeZipPath });
            }

            return  reply.send("NoData")
        }
    )
    done()
}
