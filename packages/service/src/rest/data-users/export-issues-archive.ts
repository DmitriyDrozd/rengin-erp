import '@fastify/multipart'
import * as fs from 'fs';

import BRANDS from "iso/src/store/bootstrap/repos/brands";
import path from 'path';
import dayjs from "dayjs";
import {IssueVO} from "iso/src/store/bootstrap/repos/issues";
import {ISOState} from "iso/src/ISOState";
import AdmZip from "adm-zip";

const issueFilesArrayProps = ['actFiles', 'workFiles', 'checkFiles'] as const;
const issueHasImages = (issue: IssueVO) =>
    issueFilesArrayProps.some( name => issue[name]?.length);

export const publicDir = path.join(__filename, '..','..','..','..','..','static')
export const allIssuesFolder = path.join(publicDir,'uploads', 'issues')

export const exportIssuesArchive = async (state: ISOState, issues: IssueVO[]) => {
    const reportDateTime = dayjs().format('YYYY-MM-DD_HH-mm-ss');
    const relativeZipPath = `/archives/${reportDateTime}.zip`;
    const fullZipPath = publicDir + relativeZipPath;

    const zip = new AdmZip();

    const issuesWithImages = issues.filter(issueHasImages);
    const issuesToArchive: Promise<void>[] = issuesWithImages.map(issue => {
        const issueFolder = BRANDS.selectById(issue.brandId!)(state).brandName + '_' + issue.clientsIssueNumber;
        const fullIssueFolder = path.join(allIssuesFolder, issueFolder);

        if (fs.existsSync(fullIssueFolder)) {
            return zip.addLocalFolderPromise(fullIssueFolder, { zipPath: issueFolder });
        }

        return Promise.resolve();
    });

    await Promise.all(issuesToArchive);
    await zip.writeZipPromise(fullZipPath);

    return relativeZipPath;
}

