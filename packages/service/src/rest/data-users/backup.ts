import { execSync } from 'node:child_process';
import * as fs from 'fs';
import path from 'path';

const publicDir = path.join(__filename, '..','..','..','..','..','static')
const backupDir = path.join(publicDir, 'backup');

const getArchiveDate = () => {
    const [month, day, year] = new Date().toLocaleDateString('en-US').split('/');
    const shortYear = year.slice(-2);

    return [month, day, shortYear].join('-');
}

export const exportBackup = () => {
    getArchiveDate();
    const createBackupCommand = 'cd /home/rengin-erp/ && yarn run mongo:dump:prod';
    execSync(createBackupCommand);

    return `backup/${getArchiveDate()}/archive.gz`;
}

export const getBackupFolderNames = (): string[] => {
    return fs.readdirSync(backupDir);
}

export const importBackup = ({ file, folderName }: { file?: any, folderName?: string }): number => {
    let src;

    if (folderName) {
        src = `${backupDir}/${folderName}/archive.gz`;
    } else if (file) {
        src = `${backupDir}/upload/archive.gz`;
        fs.mkdirSync(`${backupDir}/upload/`);
        fs.writeFileSync(src, file);
    }

    const restoreBackupCommand: string = `docker exec -ti mongodb sh -c "mongorestore -h localhost:27017 -d rengin -u rengin -p BuildMeUp --authenticationDatabase admin targetdb ${src}"`;
    execSync(restoreBackupCommand);

    return 0;
}