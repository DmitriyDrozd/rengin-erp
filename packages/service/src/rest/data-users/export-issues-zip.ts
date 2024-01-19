import '@fastify/multipart'

import nodemailer from 'nodemailer'
import BRANDS from "iso/src/store/bootstrap/repos/brands";
import Path from "path";
import dayjs from "dayjs";
import {IssueVO} from "iso/src/store/bootstrap/repos/issues";
import AdmZip from "adm-zip";
import fse from 'fs-extra'
import {ISOState} from "iso/src/ISOState";

const util = require('node:util')
const { pipeline } = require('node:stream')
const pump = util.promisify(pipeline)
const emailCfg = {
    SMTP_HOST:"smtp.gmail.com",
    SMTP_PORT:465,
    SMTP_USERNAME:"miramaxis@gmail.com",
    SMTP_PASSWORD:"gcfk lbez dilx dhci"
}
const mailer =  nodemailer.createTransport({
    host: emailCfg.SMTP_HOST,
    port: emailCfg.SMTP_PORT,
    auth: {
        user: emailCfg.SMTP_USERNAME,
        pass: emailCfg.SMTP_PASSWORD,
    },
    })

export const ensureMoved = async (src: string, dest: string) => {
    try {
        const isExists=await fse.exists(src)
        console.log(isExists, src, )
        if (isExists) {
            console.log('moveTo',dest)
            await fse.move(src, dest,{})
            console.log('moved')
        }
    }catch (e) {
        console.log(src,e)
    }
}
const issueFilesArrayProps = ['actFiles', 'workFiles', 'checkFiles'] as const
export const publicDir = Path.join(__filename, '..','..','..','..','..','static')
export const allIssuesFolder = Path.join(publicDir,'uploads', 'issues')
export const exportIssuesZip = async (xlsxPath: string, state: ISOState, issues: IssueVO[], to: string, subject: string) => {
    const reportDateTime = dayjs().format('YYYY-MM-DD_HH-mm-ss')

    const fullZipPath = publicDir+'/reports/'+reportDateTime+'.zip'
    const notFoundFiles: {issueFolder: string, filePath?: string}[] = []
    const issueHasImages = (issue: IssueVO) =>
        issueFilesArrayProps.some( name => issue[name] && issue[name].length)
    const issuesWithImages = issues.filter(issueHasImages)
    const zip = new AdmZip()
    for(let i of issuesWithImages) {
        const issueFolder = BRANDS.selectById(i.brandId!)(state).brandName + '_' + i.clientsIssueNumber
        try {
            const fullIssueFolder = Path.join(allIssuesFolder, issueFolder)
            console.log('fullIssueFolder',fullIssueFolder)

            await zip.addLocalFolderPromise(
                 fullIssueFolder, {
                    zipPath: issueFolder
                })
        }catch (e) {
            console.error('NotFound',e)
            notFoundFiles.push(({issueFolder: issueFolder}))
        }
    }
   // await zip.writeZipPromise(publicDir+'/reports/'+reportDateTime+'.zip', {overwrite: true})
    await zip.addLocalFile(xlsxPath,"Заявки.xlsx")
   return zip


}

