import React from 'react'
import * as R from 'ramda'

export default <T>(initialState: T) => {
    const [state, merge] = React.useReducer(
        (initialState: T, partialState: Partial<T>): T =>
            R.mergeDeepRight(initialState, partialState),
        initialState,
    )

    const mergeValue = React.useCallback(
        (value: any, path?: string) => {
            (path && path.length)
                ? merge(R.assocPath(path.split('.'), value, {}))
                : merge(value)
        },
        [merge]
    )

    return [state, merge, mergeValue]
}

