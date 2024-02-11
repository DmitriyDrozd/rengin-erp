import {isNode} from '@shammasov/utils'
import {getAppStorage} from './getAppStorage'

const getStorage = () => getAppStorage()

console.log('isNode', isNode)
console.log('nowStorage is', getStorage())


export const getUserStorage = (email:string) => {
    return {
        setItem: <T = any>(key: string, value: T) =>
            typeof value === 'undefined'
                ? getStorage().removeItem(`${email}:${key}`)
                : getStorage().setItem(`${email}:${key}`, JSON.stringify(value)),

        removeItem: (key: string) =>
            getStorage().removeItem(`${email}:${key}`),

        hasItem: (key: string) =>
            getStorage().getItem(`${email}:${key}`) !== undefined,

        getItem: <T = any>(key: string, defaultValue?: T): T | undefined => {
            let result: T
            const userKey = `${email}:${key}`
            try {
                const item = getStorage().getItem(userKey)
                if (item) {
                    result = JSON.parse(item)
                }

            } catch (e) {
                console.error('Error while access localStorage with key', userKey, e)
            }

            return (typeof result !== 'undefined') ? result : defaultValue
        },
    }
}
