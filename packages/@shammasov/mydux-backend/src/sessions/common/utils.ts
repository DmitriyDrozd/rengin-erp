import crypto from 'crypto';

let generateId = () => {
    if (crypto.randomUUID)
        return crypto.randomUUID();
    return crypto.randomBytes(4).toString("hex");


}


export {generateId};


interface SanitizerFunction {
    (text: string): string;
}

const newlineVariantsRegex = /(\r\n|\r|\n)/g;

const newlineTrailingRegex = /\n+$/g;

const sanitize: SanitizerFunction = (text) => {
    let sanitized = text;

    // Standardize newlines
    sanitized = sanitized.replace(newlineVariantsRegex, "\n");

    // Strip trailing newlines
    sanitized = sanitized.replace(newlineTrailingRegex, "");

    return sanitized;
};

export type {SanitizerFunction};
export {sanitize};


/**
 * Serialize arbitrary data to a string that can be sent over the wire to the connection.
 */
interface SerializerFunction {
    (data: unknown): string;
}

const serialize: SerializerFunction = (data) => JSON.stringify(data);

export type {SerializerFunction};
export {serialize};
