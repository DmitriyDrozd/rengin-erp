import fs from 'node:fs';
import { homedir } from 'os';
import path from 'path';

export const getStaticPath = () => {
    let dir;
    if (process.env.NODE_ENV === 'production') {
        dir = '/home/rengin-static';
    } else {
        const userHomeDir = homedir();
        dir = path.join(userHomeDir, 'rengin-static');
    }

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, {recursive: true});
    }

    return dir;
};