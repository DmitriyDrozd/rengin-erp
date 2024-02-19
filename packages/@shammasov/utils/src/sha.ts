export * from './array'
export * from './time/date'
export * from './environment'
export * from './debug/estimate'
export * from './time/async'
export * from './types'
export * from './time/getYearsFromSomeToCurrent'
import * as R from 'ramda'
import emailValidation from './validation/email'

import getTimer from './time/getTimer'

export * from './types/Tagged'
export * from './stringCases'
export * from './types/isError'
export *  from './debug/index'
export * from './random/index'

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
