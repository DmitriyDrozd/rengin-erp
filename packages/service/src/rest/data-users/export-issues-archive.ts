import '@fastify/multipart'

import BRANDS from "iso/src/store/bootstrap/repos/brands";
import Path from "path";
import dayjs from "dayjs";
import {IssueVO} from "iso/src/store/bootstrap/repos/issues";
import {ISOState} from "iso/src/ISOState";
import {execSync} from 'node:child_process'

const issueFilesArrayProps = ['actFiles', 'workFiles', 'checkFiles'] as const;
const issueHasImages = (issue: IssueVO) =>
    issueFilesArrayProps.some( name => issue[name]?.length);

export const publicDir = Path.join(__filename, '..','..','..','..','..','static')
export const allIssuesFolder = Path.join(publicDir,'uploads', 'issues')
export const exportIssuesArchive = async (state: ISOState, issues: IssueVO[]) => {
    const reportDateTime = dayjs().format('YYYY-MM-DD_HH-mm-ss');
    const relativeZipPath = '/archives/' + reportDateTime + '.zip';
    const fullZipPath = publicDir + relativeZipPath;

    const issuesWithImages = issues.filter(issueHasImages);
    const issuesImageFolders = [] as string[];
    const notFoundFiles: {issueFolder: string, filePath?: string}[] = [];

    for(const issue of issuesWithImages) {
        const issueFolder = BRANDS.selectById(issue.brandId!)(state).brandName + '_' + issue.clientsIssueNumber;

        try {
            const fullIssueFolder = Path.join(allIssuesFolder, issueFolder);
            issuesImageFolders.push(fullIssueFolder);
            /* await zip.addLocalFolderPromise(
                  fullIssueFolder, {
                     zipPath: issueFolder
                 })*/
        }catch (e) {
            notFoundFiles.push(({issueFolder: issueFolder}));
            console.error('NotFound',e, 'Files: ', notFoundFiles);
        }
    }
    // await zip.writeZipPromise(publicDir+'/reports/'+reportDateTime+'.zip', {overwrite: true})
    // await zip.addLocalFile(xlsxPath,"Заявки.xlsx")

    // todo: cd to 7-zip folder on windows
    const command: string=" 7z a "+fullZipPath+" "+issuesImageFolders.map(a => ` "${a}" `).join(" ");
    console.log({command})
    execSync(command);
    console.log('COMPLETE!')

    return relativeZipPath
}

