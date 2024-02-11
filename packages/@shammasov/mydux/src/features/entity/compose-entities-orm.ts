import {combineReducers, PayloadAction, UnknownAction} from "@reduxjs/toolkit";
import * as R from "ramda";
import {indexTupleByProperty, MapFromTupleByProperty} from "@shammasov/utils";
import {GenericEntitySlice} from "./createEntitySlice";


export const composeEntitiesOrm = <T extends readonly any[] >(...tuple: T) => {
   
    
    const entitiesMap = indexTupleByProperty(tuple,'EID') as any as MapFromTupleByProperty<T,'EID'>

    const reducersMap =R.map( (res: T[number]) => res.reducer, entitiesMap)  as any as {[K in keyof T]: T[K]['reducer']}

    const entityTypeNames =Object.keys(entitiesMap)
    type EntityTypeNameTuple = typeof entityTypeNames
    type EntityTypeName = keyof typeof entitiesMap
    type AnyLedgerEntity = T[number]
    const resourcesList =tuple
    const ormEntitiesReducer = combineReducers(reducersMap)
    type ORMState = ReturnType<typeof ormEntitiesReducer>
    const selectORMState = (state: any) => state as any as ORMState
    return Object.assign(entitiesMap, {
        EntityTypeName: '' as any as EntityTypeName,
        tuple,
            selectORMState,
        exampleORMState: {} as any as ORMState,
        entitiesMap,
            reducersMap,
        match: (action: UnknownAction): boolean =>
            resourcesList.some(res => res.match(action)),
        getResourceByAction: (action: PayloadAction) =>
            (resourcesList).find(res => res.match(action)),
        getEntityByTypeName: <N extends EntityTypeName>(name: N) =>
            entitiesMap[name],
    }

    )
}


const getExampleORM = () => composeEntitiesOrm({}as any as GenericEntitySlice)
const exampleOrm = {} as any as  ReturnType<typeof getExampleORM>
export type GenericORM =typeof exampleOrm
//const a ={} as GenericORM
//a.tuple[0].getItemName


