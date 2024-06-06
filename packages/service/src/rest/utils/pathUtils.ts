import { homedir } from 'os';
import path from 'path';

export const getStaticPath = () => {
    // const userHomeDir = homedir();
    // return path.join(userHomeDir, 'rengin-static');
    return '/home/rengin-static';
};