import {loadEnv} from './env';

loadEnv(); // Executed synchronously before the rest of your app loads

require('./server');
