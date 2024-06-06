import '@fastify/multipart'
import * as fs from 'fs';
import fse from 'fs-extra';

import BRANDS from "iso/src/store/bootstrap/repos/brands";
import { execSync } from 'node:child_process';
import path from 'path';
import dayjs from "dayjs";
import {IssueVO} from "iso/src/store/bootstrap/repos/issues";
import {ISOState} from "iso/src/ISOState";
import { env } from 'process';
import { getStaticPath } from '../utils/pathUtils';

export type TIssueFileType = 'actFiles' | 'workFiles' | 'checkFiles' | 'expenseFiles';
const typeToFolderName = {
    'actFiles': 'акты',
    'workFiles': 'работы',
    'checkFiles': 'чеки',
    'expenseFiles': 'сметы',
}

const issueHasImages = (types: TIssueFileType[]) => (issue: IssueVO) =>
    types.some(type => issue[type]?.length);

const staticPath = getStaticPath();
export const allIssuesFolder = path.join(staticPath, 'uploads', 'issues')

export const exportIssuesArchive = async (state: ISOState, issues: IssueVO[], types: TIssueFileType[]) => {
    const reportDateTime = dayjs().format('YYYY-MM-DD_HH-mm-ss');
    const relativeZipPath = `/archives/${reportDateTime}.zip`;
    const fullZipPath = staticPath + relativeZipPath;
    const fullDirPath = `${staticPath}/archives/${reportDateTime}`;

    const issuesWithImages = issues.filter(issueHasImages(types));

    if (!issuesWithImages.length) {
        return;
    }

    fs.mkdirSync(fullDirPath);

    issuesWithImages
        .filter(({ clientsIssueNumber }) => clientsIssueNumber !== undefined && clientsIssueNumber !== null)
        .forEach(issue => {
            const { clientsIssueNumber, brandId } = issue;
            const issueFolder = BRANDS.selectById(brandId!)(state).brandName + '_' + clientsIssueNumber;
            const fullIssueFolder = path.join(allIssuesFolder, issueFolder);

            if (fs.existsSync(fullIssueFolder)) {
                const getFullImageFolder = (name: string): string => `${fullIssueFolder}/${name}`;

                types.forEach(type => {
                    (issue[type] as unknown as Array<{ name: string, url: string }>)
                        ?.filter(img => fse.existsSync(getFullImageFolder(img.name)))
                        .forEach((img) => {
                            const issueFolder = `${fullDirPath}/${clientsIssueNumber}`;
                            const typeFolder = `${issueFolder}/${typeToFolderName[type]}`;

                            if (!fs.existsSync(issueFolder)) {
                                fs.mkdirSync(issueFolder);
                            }

                            if (!fs.existsSync(typeFolder)) {
                                fs.mkdirSync(typeFolder);
                            }

                            const src = img.name;
                            const dest = `${typeFolder}/${src}`;

                            fs.copyFileSync(getFullImageFolder(src), dest);
                        })
                });
            }
        });

    /**
     * Путь к команде 7zip. Для целей разработки на Windows.
     */
    const sevenZip = env['7z'] || '7z';
    const archiveFromFolder = `${sevenZip} a -r "${fullZipPath}" "${fullDirPath}/*"`;

    execSync(archiveFromFolder);

    // @ts-ignore
    fs.rm(fullDirPath, { recursive: true, force: true });

    return relativeZipPath;
}

