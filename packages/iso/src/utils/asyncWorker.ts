import {AsyncActionCreators, FactoryAnyAction} from '@sha/fsa'
import {call, put, takeEvery} from 'typed-redux-saga'

export type APIResponse<T, E = string[]> = {
    result?: T
    errors?: string[]
}

const log = console.info

export function* asyncWorker<P, S, E = string[]>(
    actionCreators: AsyncActionCreators<P, S, E>,
    method: (p?: P) => Promise<S | E>,
) {
    function* callApi(action: FactoryAnyAction) {
        try {
            const response: APIResponse<S, string[]> = yield* call(method, action.payload)
            yield* put(uiDuck.actions.busy('router'))
            console.log('response', response)
            if (response.errors)
                yield* put(
                    actionCreators.failed({
                        params: action.payload,
                        errors: response.errors,
                    })
                )
            else
                yield* put(
                    actionCreators.done({
                        params: action.payload,
                        result: response.result,
                    })
                )
        } catch (e) {
            console.log(e);
            actionCreators.failed({
                params: action.payload,
                errors: [JSON.stringify(e)],
            })
        }
        yield* put(uiDuck.actions.unbusy('router'))
    }

    if (!actionCreators.started) debugger

    const pattern = action => {
        const result = actionCreators.started.isType(action)
        return result
    }

    yield* takeEvery(pattern, callApi)
}
