import '@fastify/multipart'
import * as fs from 'fs';
import fse from 'fs-extra';

import BRANDS from "iso/src/store/bootstrap/repos/brands";
import { execSync } from 'node:child_process';
import path from 'path';
import dayjs from "dayjs";
import {IssueVO} from "iso/src/store/bootstrap/repos/issues";
import {ISOState} from "iso/src/ISOState";

export type TIssueFileType = 'actFiles' | 'workFiles' | 'checkFiles';
const typeToFolderName = {
    'actFiles': 'акты',
    'workFiles': 'работы',
    'checkFiles': 'чеки',
}

const issueHasImages = (types: TIssueFileType[]) => (issue: IssueVO) =>
    types.some(type => issue[type]?.length);

export const publicDir = path.join(__filename, '..','..','..','..','..','static')
export const allIssuesFolder = path.join(publicDir,'uploads', 'issues')

export const exportIssuesArchive = async (state: ISOState, issues: IssueVO[], types: TIssueFileType[]) => {
    const reportDateTime = dayjs().format('YYYY-MM-DD_HH-mm-ss');
    const relativeZipPath = `/archives/${reportDateTime}.zip`;
    const fullZipPath = publicDir + relativeZipPath;

    // const zip = new AdmZip();

    const issuesWithImages = issues.filter(issueHasImages(types));
    const imagesToCompress: string[] = [];

    issuesWithImages.forEach(issue => {
        const issueFolder = BRANDS.selectById(issue.brandId!)(state).brandName + '_' + issue.clientsIssueNumber;
        const fullIssueFolder = path.join(allIssuesFolder, issueFolder);
        const getFullImageFolder = (name: string): string => `${fullIssueFolder}/${name}`;


        if (fs.existsSync(fullIssueFolder)) {
            types.forEach(type => {

                (issue[type] as unknown as Array<{ name: string, url: string }>)
                    ?.filter(img => fse.existsSync(getFullImageFolder(img.name)))
                    .forEach((img) => {
                            // const content = fs.readFileSync(getFullImageFolder(img.name));
                            // const entryName = `${typeToFolderName[type]}/${img.name}`;

                            imagesToCompress.push(getFullImageFolder(img.name));
                            // zip.addFile(entryName, content, '');
                            // myStream.add(fullZipPath, getFullImageFolder(img.name), {
                            //     $bin: path7zip,
                            // });
                            // zipJobs.push(addZipFile(fullZipPath, getFullImageFolder(img.name)));
                        }
                    )
            });
        }
    });

    const command: string= `7z a ${fullZipPath} ${imagesToCompress.map(img => `"${img}"`).join(' ')}`;
    await execSync(command);


    // myStream.pipe(writeStream);
    // await zip.writeZipPromise(fullZipPath);

    return relativeZipPath;
}

