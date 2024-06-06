import fs from 'node:fs';
import { homedir } from 'os';
import path from 'path';

export const getStaticPath = () => {
    const userHomeDir = homedir();
    const dir = path.join(userHomeDir, 'rengin-static');

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, {recursive: true});
    }

    return dir;
};