export * from './array'
export * from './date'
export * from './environment'
export * from './estimate'
export * from './maps'
export * from './async'
export * from './getYearsFromSomeToCurrent'
export * from './ArrayElement'
import * as R from 'ramda'
import {default as trace} from './trace'
import {default as debug} from './debug'
import {default as capitalize} from './capitalize'
import {default as filterObj} from './filterObj'
import {default as throwExpression} from './throwExpression'
import emailValidation from './validation/email'

import getTimer from './getTimer'

export { debug, capitalize, filterObj, throwExpression, trace }
export {validation} from './validation'
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

export * from './UnPromisify'
