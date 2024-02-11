import {fork, take} from "typed-redux-saga";
import oneMongoEntitySaga from "./oneMongoEntitySaga";
import {GenericORM} from "@shammasov/mydux";

export function* mongoEntitiesSaga<O extends  GenericORM = GenericORM>(orm: O) {
    const repos = {}
    for(let entitySlice of orm.entitiesMap) {

        const task = yield* fork(oneMongoEntitySaga,entitySlice)
        const action = yield* take(entitySlice.actions.allSet.match)
        console.log('Repo '+entitySlice.EID+ ' is ready. '+action.payload.length+' items found')
    }
    return repos
}