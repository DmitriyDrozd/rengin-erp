import {YPError} from './YPError';

export default class YPEnvError extends YPError<'YPEnvError'> {
    constructor(varName: string) {

        super("Environment variable " + varName + " is not set");
        this.type = 'YPEnvError'
    }
}
