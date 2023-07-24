export class YPError<T extends string> extends Error {
    public type: T

    constructor(message) {
        super(message)
    }
}
