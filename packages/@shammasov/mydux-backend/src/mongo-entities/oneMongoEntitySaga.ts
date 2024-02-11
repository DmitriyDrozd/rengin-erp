import {call, put, select, takeEvery} from 'typed-redux-saga'

import mongoRepository from "./mongoRepository"
import {GenericEntitySlice, isPersistentAction} from "@shammasov/mydux";
import {isError} from "@shammasov/utils";


export default function* oneMongoEntitySaga<S extends GenericEntitySlice>(entitySlice: S)  {

    const repo = yield* call(mongoRepository, entitySlice)

    const items = (yield* call(repo.getAll))
    type Item = S['exampleItem']

    console.log('Repo ' + entitySlice.EID + ' found item: ' + items.length)
    const action = entitySlice.actions.allSet(items)
    yield* put(
        action
    )


    yield* takeEvery( entitySlice.match, function* (action) {
        if (isPersistentAction(action)) {
            try {
                if(entitySlice.actions.manyAdded.match(action)){

                    yield* call(async () => {
                        await repo.createMany(action.payload)
                    })
                }
                else if (entitySlice.actions.added.match(action)) {
                    yield* call(async () => {
                        await repo.create(action.payload)
                    })
                }
                else if (entitySlice.actions.removed.match(action)) {
                    yield* call(async () => {
                        await repo.removeById(action.payload)
                    })
                } else if (
                    entitySlice.match(action) && action.meta.noRepo !== true
                ) {
                    const id = action.payload.id
                    if (id) {
                        const state = yield* select()
                        const slice  = entitySlice.slice.selectSlice(state)
                        const item: Item = slice.entities[id]
                        //const item: Item = yield* select(duck.selectSlice().entities[id])
                        if (!item)
                            debugger
                        yield* call(async () => {
                            await repo.updateById(item)
                        })
                    }
                }
            } catch (e: unknown) {
                if(isError(e))
                    console.log('Error save event', action, e, e.stack)
                else
                    console.log('mongoEntitySaga unknown catched', e)
            }
        }
    })
}
