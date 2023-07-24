import {call, put, select, takeEvery} from 'typed-redux-saga'
import {isNamespace} from '@sha/fsa'
import {Schema} from "mongoose"
import {DuckRepository} from './duckRepo'
import {isPersistentAction} from 'iso'

export default function* duckRepoSaga<T, ID extends keyof T, S extends Schema>
(ioOrRepo: DuckRepository<T, ID, S>, {limit} = {limit: undefined}) {

    let repo: DuckRepository<T, ID, S> = ioOrRepo

    const getAll = async () => {
        return repo.getAll({limit})
    }

    const items = (yield* call(getAll))

    console.log('Repo ' + repo.duck.factoryPrefix + ' found item: ' + items.length)

    yield* put(
        repo.duck.actions.reset(items)
    )

    yield* takeEvery(isNamespace(repo.duck.factory), function* (action) {


        if (isPersistentAction(action)) {
            try {
                if (repo.duck.actions.added.isType(action)) {
                    yield* call(async () => {
                        await repo.create(action.payload)
                    })
                }
                if (repo.duck.actions.removed.isType(action)) {
                    yield* call(async () => {
                        await repo.removeById(action.payload)
                    })
                } else if (
                    isNamespace(repo.duck.factory)(action) && action.meta.noRepo !== true
                ) {
                    const id = action.payload[repo.idProp] || action[repo.idProp]
                    if (id) {
                        const item: T = yield* select(repo.duck.selectById(id))
                        if (!item)
                            debugger
                        yield* call(async () => {
                            await repo.updateById(item)
                        })
                    }
                }
            } catch (e) {
                console.log('Error save event', action, e, e.stack)
            }
        }
    })
}
