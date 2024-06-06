import '@fastify/multipart';

import BRANDS from 'iso/src/store/bootstrap/repos/brands';
import Path from 'path';
import dayjs from 'dayjs';
import { IssueVO } from 'iso/src/store/bootstrap/repos/issues';
import { ISOState } from 'iso/src/ISOState';

import { execSync } from 'node:child_process';
import { getStaticPath } from '../utils/pathUtils';

const issueFilesArrayProps = ['actFiles', 'workFiles', 'checkFiles'] as const;

export const exportIssuesZip = async (xlsxPath: string, state: ISOState, issues: IssueVO[], to: string, subject: string) => {
    const staticPath = getStaticPath();
    const allIssuesFolder = Path.join(staticPath, 'uploads', 'issues');

    const reportDateTime = dayjs().format('YYYY-MM-DD_HH-mm-ss');

    const relativeZipPath = '/reports/' + reportDateTime + '.zip';
    const fullZipPath = staticPath + relativeZipPath;

    const notFoundFiles: { issueFolder: string, filePath?: string }[] = [];
    const issueHasImages = (issue: IssueVO) =>
        issueFilesArrayProps.some(name => issue[name] && issue[name].length);
    const issuesWithImages = issues.filter(issueHasImages);
    const issuesImageFolders = [] as string[];

    for (let i of issuesWithImages) {
        const issueFolder = BRANDS.selectById(i.brandId!)(state).brandName + '_' + i.clientsIssueNumber;

        try {
            const fullIssueFolder = Path.join(allIssuesFolder, issueFolder);
            issuesImageFolders.push(fullIssueFolder);
        } catch (e) {
            console.error('NotFound', e);
            notFoundFiles.push(({issueFolder: issueFolder}));
        }
    }

    // await zip.writeZipPromise(staticPath+'/reports/'+reportDateTime+'.zip', {overwrite: true})
    // await zip.addLocalFile(xlsxPath,"Заявки.xlsx")

    const buildArchive = async () => {
        const command: string = ' 7z a ' + fullZipPath + ' ' + xlsxPath + ' ' + issuesImageFolders.map(a => ` "${a}" `).join(' ');
        console.log({command});
        const buffer = await execSync(command);
        console.log('COMPLETE!');
    };
    await buildArchive();

    return relativeZipPath;
};

