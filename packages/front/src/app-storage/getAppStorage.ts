import {isNode} from '@shammasov/utils'

type Store = {};

// Mocking LocalStorage (or similar) ensures no conflict with existing browser
// data and works in test environments like Jest
export class StorageMock {
    store: Store;

    constructor(store: Store) {
        this.store = {...store};
    }

    getItem(key: string) {
        return this.store[key] || null;
    }

    hasItem(key: string) {
        return this.store !== undefined
    }

    setItem(key: string, value: { toString: () => string }) {
        this.store[key] = value.toString();
    }

    removeItem(key: string) {
        delete this.store[key];
    }
}

const mockStorage = new StorageMock({})

const getStorage = () => localStorage
console.log('isNode', isNode)
console.log('nowStorage is', getStorage())


export const getAppStorage = () => {
    return {

        setItem: <T = any>(key: string, value: T) =>
            typeof value === 'undefined'
                ? getStorage().removeItem(key)
                : getStorage().setItem(key, JSON.stringify(value)),

        removeItem: (key: string) =>
            getStorage().removeItem(key),

        hasItem: (key: string) =>
            getStorage().getItem(key) !== undefined,

        getItem: <T = any>(key: string, defaultValue?: T): T | undefined => {
            let result: T
            try {
                const item = getStorage().getItem(key)
                if (item) {
                    result = JSON.parse(item)
                }

            } catch (e) {
                console.error('Error while access localStorage with key', key, e)
            }

            return (typeof result !== 'undefined') ? result : defaultValue
        }
    }
}
