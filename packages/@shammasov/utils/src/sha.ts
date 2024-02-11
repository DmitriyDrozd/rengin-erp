export * from './array'
export * as fs from './sha-fs'
export * from './time/date'
export * from './environment'
export * from './debug/estimate'
export * from './maps'
export * from './time/async'
export * from './types'
export * from './time/getYearsFromSomeToCurrent'
import * as R from 'ramda'
import {default as capitalize} from './capitalize'
import emailValidation from './validation/email'

import getTimer from './time/getTimer'
export * from './isError'
export *  from './debug/index'
export * from './random/index'

export {capitalize}
export {validation} from './validation/validation'
export {emailValidation, getTimer}

export const swap = R.curry((index1, index2, list) => {
    if (index1 < 0 || index2 < 0 || index1 > list.length - 1 || index2 > list.length - 1) {
        return list // download out of bound
    }
    const value1 = list[index1]
    const value2 = list[index2]
    return R.pipe(
        R.set(R.lensIndex(index1), value2),
        R.set(R.lensIndex(index2), value1)
    )(list)
})


export * from './typings'