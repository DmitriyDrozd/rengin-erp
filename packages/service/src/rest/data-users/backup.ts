import { config } from '@app-config/main';
import { execSync } from 'node:child_process';
import * as fs from 'fs';
import path from 'path';

const publicDir = path.join(__filename, '..','..','..','..','..','static')
const backupDir = path.join(publicDir, 'backup');

const getArchiveDate = () => {
    const [month, day, year] = new Date().toLocaleDateString('en-US').split('/');
    const resMonth = month.length === 1 ? `0${month}` : month;
    const resDay = day.length === 1 ? `0${day}` : day;
    const shortYear = year.slice(-2);

    return [resMonth, resDay, shortYear].join('-');
}

export const exportBackup = () => {
    getArchiveDate();
    const createBackupCommand = 'cd /home/rengin-erp/ && yarn run mongo:dump:prod';
    execSync(createBackupCommand);

    return `/backup/${getArchiveDate()}/archive.gz`;
}

export const getBackupFolderNames = (): string[] => {
    return fs.readdirSync(backupDir);
}

export const importBackup = ({ file, folderName }: { file?: any, folderName?: string }): number => {
    let dockerContainerSrc;

    if (folderName) {
        dockerContainerSrc = `${backupDir}/${folderName}/archive.gz`;
    } else if (file) {
        dockerContainerSrc = `${backupDir}/upload/archive.gz`;
        fs.mkdirSync(`${backupDir}/upload/`);
        fs.writeFileSync(dockerContainerSrc, file);

        const copyCommand = `docker cp ${folderName}/archive.gz mongodb:/dump/${folderName}`;
        execSync(copyCommand);
    }

    const restoreBackupCommand: string = `docker exec mongodb sh -c "mongorestore ${config.MONGO_URI} --archive='${dockerContainerSrc}'"`;
    execSync(restoreBackupCommand);

    return 0;
}