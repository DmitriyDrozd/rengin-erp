import * as FSA from './fsa'
import {FactoryAnyAction} from './fsa'
import * as R from 'ramda'
import {Reducer} from 'redux'
import {AssociativeArray, toAssociativeArray} from '@sha/utils'
import moize from 'moize'
import {BootableDuck} from './createBootableDuck'


export const isCRUD = (duck: Crud<any> | BootableDuck<any>): duck is Crud<any, any, any> =>
    duck.actions && 'isCRUD' in duck

const createCRUDDuck = <T,ID extends keyof T, Prefix extends string> (
    factoryPrefix: Prefix,
    idProp: ID,
    indicies:Exclude<keyof T, ID>[] = [],
    defaultProps: T = {} as any,
    defaultPersistent = true,
    get = (state: any): T[] => state.app.bootstrap[factoryPrefix]
) => {
    type IDType = T[ID]
    const factory = FSA.actionCreatorFactory(factoryPrefix, {persistent: defaultPersistent})
    type PatchBase = { [P in ID]: string }
    const patchCreator = factory<T>('patched', {persistent: defaultPersistent})
    const addedRaw = factory<T>('added', {persistent: defaultPersistent})

    const actions = {
        reset: factory<T[]>('reset', {persistent: false}),
        resetOne: factory<T>('resetOne', {persistent: false}),
        addedBatch: factory<T[]>('addedBatch', {persistent: defaultPersistent}),
        updatedBatch: factory<T[]>('updatedBatch', {persistent: defaultPersistent}),
        patchedBatch: factory<T[]>('patchedBatch', {persistent: defaultPersistent}),
        removedBatch: factory<IDType[]>('removedBatch', {persistent: defaultPersistent}),
        added: addedRaw,
        requested: factory<IDType>('requested', {persistent: false}),
        removed: factory<IDType>('removed', {persistent: defaultPersistent}),
        patched: Object.assign((patch: PatchBase & Partial<T>, original: Partial<T> = {}) => {
            const diff = {
                [idProp]: patch[idProp]
            }

            let diffFlag = false
            for (const [key] of Object.entries({ ...patch, ...original })) {
                if (!R.equals(patch[key], original[key])) {
                    diff[key] = patch[key] === undefined ? null : patch[key]
                    diffFlag = true
                }
            }

            return diffFlag
                // @ts-ignore
                ? patchCreator({...diff, [idProp]: patch[idProp] || original[idProp]})
                : undefined
            },
            {
                ...patchCreator
            }
        ),
        updated: factory<T>('updated', {persistent: defaultPersistent}),
    }

    const commands = {
        requestAdd: factory<T>('requestAdd'),
        requestRemove: factory<IDType>('requestRemove'),
        requestPatch: factory<Partial<T>>('requestPatch'),
        requestUpdate: factory<T>('requestUpdate'),


    }

    const events = {
        addFailed: factory<Error>('addFailed'),
        removeFailed: factory<Error>('removeFailed'),
        patchFailed: factory<Error>('patchFailed'),
        updateFailed: factory<Error>('updateFailed')
    }



    const reducer = FSA.reducerWithInitialState([]as T[])
        .case(
            actions.reset,
            (_, payload) => payload,
        )
        .case(
            actions.resetOne,
            (state, payload) => {
                const index =state.findIndex(p => p[idProp] === payload[idProp])
                if(index !== -1) {
                    let newState = [...state]
                    newState[index] = payload
                    return newState
                }
                return [...state, payload]
            },
        )
        .cases(
            [events.removeFailed],

            (state, payload) => {
                if(typeof payload === 'number' || typeof payload === 'string') {
                    return {...state, status: 'failed'}
                }
                return state
            }
        )
        .cases(
            [events.updateFailed, events.patchFailed],

            (state, payload) => {
                if(payload[idProp]) {
                    return {...state, status: 'failed'}
                }
                return state
            }
        )
        .case(
            actions.added,
            // @ts-ignore
            (state, payload) => R.append(R.mergeDeepRight(defaultProps, payload), state),
        )
        .case(
            actions.addedBatch,
            (state, payload) => {
                // fixme: called 2 times (one from local, one from SSE) so need to filter. Fix first call execution
                const newState = payload.map(item => ({ ...defaultProps, ...item })).filter(item => !state.find(s => s[idProp] === item[idProp]));
                const result = [
                    ...state,
                    ...newState,
                ];

                return result;
            },
        )
        .case(
            actions.removed,
            (state, payload) => R.reject(obj => obj[idProp] === payload, state),
        )
        .case(
            actions.removedBatch,
            // @ts-ignore
            (state, payload) =>R.reject(obj => payload.includes(obj[idProp]), state),
        )
        .case(
            actions.updated,
            (state, payload) => {
                const id = payload[idProp]
                const index = state.findIndex(item => item[idProp] === id)
                if (index === -1)
                    return R.prepend(R.mergeDeepRight(defaultProps, payload), state)
                const newState = state.concat()
                newState[index] = payload
                return newState
            }
        )
        .case(
            actions.updatedBatch,
            // @ts-ignore
            (state, payload) => {
                let newState = [...state]
                payload.forEach( i => {
                    const id = i[idProp]
                    const index = newState.findIndex(item => item[idProp] === id)
                    if (index === -1)
                        newState = R.prepend(R.mergeDeepRight(defaultProps, i), newState)
                    else
                        newState[index] = {...defaultProps, ...i}
                })

                return newState
            }
        )

        .case(
            actions.patched,
            (state, payload) => {
                const id = payload[idProp]
                const index = state.findIndex(item => item[idProp] === id)
                if (index === -1)
                    return [...state, payload]


                const arr = [...state]
                let element
                const source = state[index]
                try {
                    element = R.mergeDeepRight(source, payload)
                } catch (e) {
                    console.error(e)
                }
                arr[index] = element
                return arr
            }
        )
        .case(
            actions.patchedBatch,
            // @ts-ignore
            (state, payload) => {
                let newState = [...state]
                payload.forEach( i => {
                    const id = i[idProp]
                    const index = newState.findIndex(item => item[idProp] === id)
                    if (index === -1)
                        newState = R.prepend(R.mergeDeepRight(defaultProps, i), newState) as any
                    else
                        newState[index] = {...newState[index], ...i}
                })

                return newState
            }
        )

    const selectById = (id: string) => (state: any): T | undefined => {
        const array: T[] = get ? get(state) : state

        for (let i = 0; i < array.length; i++)
            // @ts-ignore
            if (array[i][idProp] === id)
                return array[i]

        // throw new Error(factoryPrefix + ' with id '+id + ' not found')
        return undefined
    }
    const selectManyByIds = (ids: string[]) => (state: any): T[] => {
        const array: T[] = get ? get(state) : state
        const result: T[] = []
        for (let i = 0; i < array.length; i++)
            // @ts-ignore
            if (ids.includes(array[i][idProp]))
                result.push(array[i])

        // throw new Error(factoryPrefix + ' with id '+id + ' not found')
        return result
    }

    const selectPropEq = <K extends (keyof T)>(key: K) => (value: T[K]) => (state: any): T[] => {
        const array: T[] = get ? get(state) : state
        const items: T[] = [] as T[]
        for (let i = 0; i < array.length; i++)
            if (array[i][key] === value)
                items.push(array[i])

        return items
    }

    const concatItemReducer = (handleItem: (state: T, action: any) => T) => {
        const result = (state: T[] = [], action) => {
            state = reducer(state, action)

            if ((action.type.startsWith(factoryPrefix))) {

                let id = action.payload[idProp]
                if(!id) {
                    if(action?.payload?.params)
                        id = action.payload?.params[idProp]
                    if(!id && action?.payload?.result)
                        id = action.payload?.result[idProp]
                }
                if (id) {
                    const prevItem = state.find(item => item[idProp] === id)
                    const itemIndex = state.findIndex(item => item[idProp] === id)
                    if (prevItem) {
                        const newItem = handleItem(prevItem, action)
                        if (newItem !== prevItem) {


                            state = [...state]
                            state[itemIndex] = newItem
                        }
                    }
                }
            }

            return state
        }

        return Object.assign(result, {duck}) as any as Reducer<T[], FactoryAnyAction> & { duck: any }
    }
    const listToMap = moize((list: T[]): AssociativeArray<T> => {
        const map = toAssociativeArray<T>(idProp as any )(list)
        return map as Record<string|number, T>
    })


    const selectAll = (state: any): T[] => {
        const array: T[] = get(state)
        return array as any as T[]
    }

    const selectMap = state => {
        return listToMap(selectAll(state))
    }

    const duck = {

        getId: (item: T): string =>
            item[idProp] as any as string,
        factoryPrefix,
        idProp,
        idKey: idProp,
        factory,
        commands,
        indicies,
        plural: factoryPrefix,
        getItemName: (item:T) =>
            item[idProp],
        actions: {...actions, ...commands, ...events},
        reducer: reducer as any as (state: T[], action: FactoryAnyAction) => T[],
        concatItemReducer,
        isCRUD: true,
        isValid: (state, action) => {

            if (
                actions.added.isType(action)
            ) {

                const idToAdd = action.payload[idProp]
                // @ts-ignore
                if (selectById(idToAdd)(state)) {
                    return 'Id ' + idToAdd + ' already exists in ' + factoryPrefix + ' collection'
                }
            }
            return undefined
        },

            selectAll,
            selectAllAsMap:selectMap,
            selectMap,
            selectList: selectAll,
            selectAllExceptById: (id: string) => (state: any) => {
                const array: T[] = get ? get(state) : state
                const result: T[] = []
                for (let i = 0; i < array.length; i++)
                    // @ts-ignore
                    if (array[i][idProp] !== id)
                        result.push(array[i])

                // throw new Error(factoryPrefix + ' with id '+id + ' not found')
                return result
            },
            selectById: (id: string|number) => (state: any): T => {
            try {
                const map = selectMap(state)
                return map[id]
            } catch (e){
                console.error(e)
                return  undefined
            }
            },
            selectManyByIds,

            selectPropEq,
            selectEq: (query: Partial<T>) => (state: any) => {
                const array: T[] = get ? get(state) : state
                const items: T[] = R.filter(R.whereEq<Partial<T>>(query), array)

                return items
            },
            selectEqOne: (query: Partial<T>) => (state: any): T => {
                const array: T[] = get ? get(state) : state
                const items: T[] = R.filter(R.whereEq<Partial<T>>(query), array)

                return items[0]
            },

            select: (query: Record<keyof Partial<T>, any>) => (state: any) => {
                const array: T[] = get ? get(state) : state
                const items: T[] = []
                for (let i = 0; i < array.length; i++) {
                    if (R.where<Partial<T>>(query)(array[i]))
                        items.push(array[i])
                }

                return items
            },

            isEventAffectsItemId: e => (id)=> {
                if(factory.isNamespace(e)) {
                    if(actions.removed.isType(e)) {
                        return e.payload === id
                    }
                    if(actions.removedBatch.isType(e)) {
                        return e.payload.includes(id)
                    }
                    if(actions.added.isType(e) ||
                        actions.updated.isType(e) ||
                        actions.patched.isType(e)
                    ) {
                        return e.payload[idProp] === id
                    }
                    if(actions.addedBatch.isType(e) ||
                        actions.updatedBatch.isType(e) ||
                        actions.patchedBatch.isType(e)
                    ) {
                        return e.payload.find( item => item[idProp] === id)
                    }

                    return false

                }

            }


    }

    return duck
}

class Clazz<T,ID extends keyof T = any,P extends string = any>{
    public getDuck = (defaultItem:T)=> {
        return createCRUDDuck<T, ID, P>('list' as any as P, 'id' as any as ID)
    }
}

export type Crud<T,ID extends keyof T = any,P extends string = any> = ReturnType<Clazz<T, ID, P>['getDuck']>
export default createCRUDDuck
