import {combineReducers, PayloadAction, UnknownAction} from "@reduxjs/toolkit";
import {indexTupleByProperty, MapFromTupleByProperty, toCamelCase} from "@shammasov/utils";
import {GenericEntitySlice} from "./createEntitySlice";
import {CamelCase} from "type-fest";


export const composeEntitiesOrm = <T extends readonly any[] >(...tuple: T) => {
   
    
    const entitiesMap = indexTupleByProperty(tuple,'EID') as any as MapFromTupleByProperty<T,'EID'>

    const reducersMap ={} as any as {[K in keyof typeof entitiesMap as  `${CamelCase<string & K>}`]: typeof entitiesMap[K]['reducer']}
    Object.keys(  entitiesMap).forEach( <K extends keyof typeof entitiesMap>(k: K)=>
        reducersMap[toCamelCase(k)] = entitiesMap[k].reducer
    )
    const entityTypeNames =Object.keys(entitiesMap)
    type EntityTypeNameTuple = typeof entityTypeNames
    type EntityTypeName = keyof typeof entitiesMap
    type AnyLedgerEntity = T[number]
    const entitysList =tuple
    const ormEntitiesReducer = combineReducers(reducersMap)
    type ORMState = ReturnType<typeof ormEntitiesReducer>
    const selectORMState = (state: any) => state as any as ORMState
    return Object.assign(entitiesMap, {
        EntityTypeName: '' as any as EntityTypeName,
        tuple,
            selectORMState,
            ormEntitiesReducer,
        exampleORMState: {} as any as ORMState,
        entitiesMap,
            reducersMap,
        match: (action: UnknownAction): boolean =>
            entitysList.some(entity => entity.match(action)),
        getResourceByAction: (action: PayloadAction) =>
            (entitysList).find(entity => entity.match(action)),
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


