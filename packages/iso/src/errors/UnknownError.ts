import {YPError} from './PrintmanError';

export class UnknownError extends YPError<'UnknownError'> {

    public source: unknown
    public sourceMessage: string

    constructor(e: unknown) {
        super('Unknown error');
        this.source = e
        this.type = 'UnknownError'
        if (e instanceof Error) {
            this.sourceMessage = e.message
            this.stack = e.stack
            this.name = e.name
        }
    }
}
