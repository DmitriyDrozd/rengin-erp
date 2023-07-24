import {curry, mergeDeepRight} from 'ramda'

const mergeDeep = <T>(obj1: Partial<T>, obj2: Partial<T>): T => {
    // @ts-ignore
    return mergeDeepRight(obj1, obj2)
}

export default curry(mergeDeep)