import {call, put, select, takeEvery} from 'typed-redux-saga'
import {isNamespace} from '@sha/fsa'
import {Schema} from 'mongoose'
import getMongoDAO, {DuckRepository} from './getMongoDAO'
import {isPersistentAction,Res} from 'iso'
import {getPGDAO} from "./getPGDAO";
import {SagaOptions} from "../sagaOptions";
import {Repo} from "./getRepo";
import {UnionRes} from "iso/src/store/bootstrap/resourcesList";

export default function* duckRepoSaga<R extends Repo>(repo: R, io: SagaOptions)  {

    const getAll = async () => {
        return await repo.mongoDao.getAll()
    }

    /*if(repo.duck.factoryPrefix  === 'users')
        debugger

     */
    const items = (yield* call(getAll))

    console.log('Repo ' + repo.factoryPrefix + ' found item: ' + items.length)

    yield* put(
        repo.actions.reset(items)
    )
    yield* call(repo.pgDao.createMany,items)

    yield* takeEvery(isNamespace(repo.factory), function* (action) {


        if (isPersistentAction(action)) {
            console.log('DuckRepoSaga ',action.type)
            try {
                if(repo.actions.addedBatch.isType(action)){
                    yield* call(async () => {

                        await repo.mongoDao.createMany(action.payload)
                        await repo.pgDao.createMany(action.payload)
                    })
                }
                if (repo.actions.added.isType(action)) {
                    yield* call(async () => {
                        await repo.mongoDao.create(action.payload)
                        await repo.pgDao.create(action.payload)
                    })
                }
                if (repo.actions.removed.isType(action)) {
                    yield* call(async () => {
                        await repo.mongoDao.removeById(action.payload)
                        await repo.pgDao.removeById(action.payload)
                    })
                } else if (
                    isNamespace(repo.factory)(action) && action.meta.noRepo !== true
                ) {
                    const id = action.payload[repo.idProp] || action[repo.idProp]
                    if (id) {
                        const item: T = yield* select(repo.selectById(id))
                        if (!item)
                            debugger
                        yield* call(async () => {
                            await repo.mongoDao.updateById(item)
                            await repo.pgDao.updateById(item)
                        })
                    }
                }
            } catch (e) {
                console.log('Error save event', action, e, e.stack)
            }
        }
    })
}
