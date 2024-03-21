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
    const imagesNames: { src: string, dest: string }[] = [];

    issuesWithImages.forEach(issue => {
        const issueFolder = BRANDS.selectById(issue.brandId!)(state).brandName + '_' + issue.clientsIssueNumber;
        const fullIssueFolder = path.join(allIssuesFolder, issueFolder);
        const getFullImageFolder = (name: string): string => `${fullIssueFolder}/${name}`;


        if (fs.existsSync(fullIssueFolder)) {
            types.forEach(type => {

                (issue[type] as unknown as Array<{ name: string, url: string }>)
                    ?.filter(img => fse.existsSync(getFullImageFolder(img.name)))
                    .forEach((img) => {
                        const src = img.name;
                        const dest = `${typeToFolderName[type]}/${src}`;

                        imagesToCompress.push(getFullImageFolder(src));
                        imagesNames.push({ src, dest });
                    })
            });
        }
    });

    /**
     * Путь к команде 7zip. Для целей разработки на Windows использовать вариант с полным путем
     */
    // const sevenZip = '"C:\\Program Files\\7-Zip\\7z.exe"';
    const sevenZip = '7z';

    const archiveCreate = `${sevenZip} a "${fullZipPath}" ${imagesToCompress.map(img => `"${img}"`).join(' ')}`;
    const archiveSubFolders = `${sevenZip} rn "${fullZipPath}" ${imagesNames.map(
        ({ src, dest }) => `"${src}" "${dest}"`
    ).join(' ')}`;

    execSync(archiveCreate);
    execSync(archiveSubFolders);

    return relativeZipPath;
}

