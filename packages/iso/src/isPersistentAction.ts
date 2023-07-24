import {FactoryAnyAction} from '@sha/fsa'
import {Action} from 'redux'

export default (action: Action | FactoryAnyAction) => {
    const result = action && action.meta && (action.meta.persistent === true)

    return result
}
