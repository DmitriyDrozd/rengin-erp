
const isBrowser = () =>typeof window !== 'undefined' && typeof window.document !== 'undefined';

/* eslint-disable no-restricted-globals */
const isWebWorker = () =>
    typeof self === 'object' &&
    self.constructor &&
    self.constructor.name === 'DedicatedWorkerGlobalScope';
/* eslint-enable no-restricted-globals */

const isNode = () =>
    typeof process !== 'undefined' &&
    process.versions != null &&
    process.versions.node != null;

export {
    isBrowser,
    isWebWorker,
    isNode
};
// tslint:disable-next-line:variable-name
let __production: boolean = true

export const setProduction = value =>
    __production = value

export const isProduction = () =>
    __production


