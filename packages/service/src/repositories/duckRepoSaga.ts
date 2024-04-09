import {call, put, select, takeEvery} from 'typed-redux-saga'
import {isNamespace} from '@sha/fsa'
import {isPersistentAction} from 'iso'
import {SagaOptions} from "../sagaOptions";
import {Repo} from "./getRepo";
import {config} from "@app-config/main";

export default function* duckRepoSaga<R extends Repo>(repo: R, io: SagaOptions)  {

    const getAll = async () => {
        return await repo.mongoDao.getAll()
    }

    /*if(repo.duck.factoryPrefix  === 'users')
        debugger

     */
    const items = (yield* call(getAll))

    console.log('Repo ' + repo.factoryPrefix + ' found item: ' + items.length)

    if(config.WRITE_PG===true)
    yield* call(repo.pgDao.createMany,items)
    yield* put(
        repo.actions.reset(items)
    )


    yield* takeEvery(isNamespace(repo.factory), function* (action) {


        if (isPersistentAction(action)) {
            console.log('DuckRepoSaga ',action.type)
            try {
                if(repo.actions.addedBatch.isType(action)){
                    yield* call(async () => {

                        await repo.mongoDao.createMany(action.payload)
                        if(config.WRITE_PG===true)
                        await repo.pgDao.createMany(action.payload)
                    })
                }
                if (repo.actions.added.isType(action)) {
                    yield* call(async () => {
                        await repo.mongoDao.create(action.payload)
                        if(config.WRITE_PG===true)
                        await repo.pgDao.create(action.payload)
                    })
                }
                if (repo.actions.removed.isType(action)) {
                    yield* call(async () => {
                        await repo.mongoDao.removeById(action.payload, true)
                        if(config.WRITE_PG===true)
                        await repo.pgDao.removeById(action.payload)
                    })
                } if (repo.actions.removedBatch.isType(action)) {
                    yield* call(async () => {
                        await Promise.all(action.payload.map(async (item) => repo.mongoDao.removeById(item, true)));

                        if (config.WRITE_PG===true) {
                            await Promise.all(action.payload.map(async (item) => repo.pgDao.removeById(item)));
                        }
                    })
                }
                if (repo.actions.updatedBatch.isType(action)) {
                    yield* call(async () => {
                        await Promise.all(action.payload.map(async (item) => repo.mongoDao.updateById(item)));

                        if (config.WRITE_PG===true) {
                            await Promise.all(action.payload.map(async (item) => repo.pgDao.updateById(item)));
                        }
                    })
                }
                else if (
                    isNamespace(repo.factory)(action) && action.meta.noRepo !== true
                ) {
                    const id = action.payload[repo.idProp] || action[repo.idProp]
                    if (id) {
                        const item: T = yield* select(repo.selectById(id))
                        if (!item)
                            debugger
                        yield* call(async () => {
                            await repo.mongoDao.updateById(item)
                            if(config.WRITE_PG===true)
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
