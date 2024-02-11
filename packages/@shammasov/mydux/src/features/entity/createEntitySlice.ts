import {$Values} from "utility-types"
import type {ActionReducerMapBuilder} from "@reduxjs/toolkit"
import {UnknownAction} from "@reduxjs/toolkit"
import {createAdvancedEntityAdapter, EntityState} from "./create-advanced-entity-adapter"
import * as R from "ramda"
import {uniq} from "ramda"
import { generateGuid, Return, toAssociativeArray, toIndexedArray} from "@shammasov/utils"
import {AnyAttributes, AttrFactories_ex, ItemByAttrs, ItemOfAttr} from "./AttrFactories_ex";


export type ResourceLang = Partial<{
    singular: string,
    some: string,
    plural: string,
    name: string,
    gender: 'm' | 'n' | 'f',
}>

export type EntityOptions<Attrs extends AnyAttributes> = {
    nameProp?: keyof Attrs
    langRU: ResourceLang
    extraEntityReducers?:  (builder: ActionReducerMapBuilder<EntityState<Attrs>>) => void
    getItemName?: (item: ItemByAttrs<Attrs>) => string
}

export type StateWith<K extends string, T> =
   {
        [x in  K]: T
    }
export const commonAttrs = {
    id: AttrFactories_ex.string({headerName: 'ID', default: () => generateGuid(),isIDProp: true,unique: true, colDef:false}),
    removed: AttrFactories_ex.boolean({select: false, colDef: false}),
    addedAtTS: AttrFactories_ex.timestamp({headerName:'Добавлен', default: () => new Date().getTime()})
}

export type LinkedAttrsKeys<Attrs extends AnyAttributes> =Extract<keyof Attrs,`${string}Id`>

export type StateWithEntity<E> = E extends EntitySlice<infer Attrs, infer EID>
    ?  StateWith<EID,EntityState<Attrs>>
    : unknown
export type StateWithEntityByEIDAttrs<Attrs extends AnyAttributes,EID extends string = string> = {
    [k in EID]: ItemByAttrs<Attrs>
}
export const createEntitySlice = <Attrs extends AnyAttributes,EID extends string = string,Item extends ItemByAttrs<Attrs>=  ItemByAttrs<Attrs>>
(EID: EID, attributes: Attrs,{langRU,...rest}: EntityOptions< Attrs>) => {
type RootState = StateWith<EID, EntityState<Attrs>>
    const props = {
        langRU,
        EID,
        reducerPath: EID,
        attributes,
        exampleItem: {} as any as Item
    }
    const attributesList:(Attrs[keyof Attrs])[]  = []

    Object.keys(props.attributes).forEach( k => {
        const p =props.attributes[k]
        attributesList.push(p as any)
        p.name = k
        p.headerName = p.headerName || p.name
    })

    const defaultGetItemName =  ((item: Item): string => {
        const i = item
        const propName =attributesList[1].name  || 'id'
        return i[propName] as string
    }) as any
    const getItemName = rest.getItemName || defaultGetItemName

    const slice = createAdvancedEntityAdapter<Attrs, EID>({
        name: EID,
        extraEntityReducers: (builder) => builder,
        attributes
    })
    const selectById = (id: string) => (state: RootState) =>
        state[EID].entities[id] as any as Item


    const selectAll = (state:RootState) =>
        Object.values(state[EID].entities) as Item[]

    const selectEq = (query: Partial<Item>) => (state: any) => {
        const array: Item[] =selectAll(state)
        const items: Item[] = R.filter(R.whereEq<Partial<Item>>(query), array)

        return items
    }
    const    selectEqOne = (query: Partial<Item>) => (state: any): Item => {
        const array: Item[] = selectAll(state)
        const items: Item[] = R.filter(R.whereEq<Partial<Item>>(query), array)

        return items[0]
    }
    const selectMapByNames= (state: RootState) => {
        const list = selectAll(state)
        return list.reduce((map, item) =>{
            const name =getItemName(item)
            map[name] = item
            if(!item[`${EID}Name`])
                item[`${EID}Name`] = name
            return map
        } ,{} as any as Record<string, Item>)

    }
    const selectEntityDigest = (state:RootState) => {
            const list =  selectAll(state)
            const byId = toAssociativeArray('id')(list)
            const byName = selectMapByNames(state)
            const maps: LinkedAttrsKeys<Attrs> = {} as any
            const indexMapByProp = (p: ItemOfAttr) => {
                const map: Record<string, Item[]> = {}
                list.forEach( (item) => {
                    if(!map[item[p.name]])
                        map[item[p.name]]= []
                    map[item[p.name]].push(item)
                })
            }
            return {
                list, byId, byName, byRes: <K extends keyof LinkedAttrsKeys<Attrs>>(key:K)=> {
                    if(!maps[key])
                        maps[key] = indexMapByProp(attributes[key])
                    return linkedId =>
                        maps[key][linkedId] || []

                }
            }
        }



    const result = {
        ...props,
        match: (action: UnknownAction): action is SliceActions<typeof slice> =>
            action.type.startsWith(EID+'/') || action.type.startsWith(EID.toLowerCase()+'/'),

        getPropByName: <K extends keyof ItemByAttrs<Attrs>>(key: K) =>
            attributes[key],
        attributesList: attributesList as   any as $Values<Attrs>[],
        asOptions: (init?: Item[]) => (state: RootState) => {

            const list = init || selectAll(state as any)
            const options = list.map( item => ({
                value: item.id,
                label: getItemName(item as any as Item),
            }))
            console.log('asOptions', options)
            return options
        },
          asValueEnum: (list?: Item[]) => (state: RootState) => {

            const workList =list ||  selectAll(state as any)
            const options: Record<string, string> = {}
            workList.map( item => {
                console.log('item',item)
                options[String(item.id)] = String(getItemName(item))
            })
            console.log('asValueEnum', options)
            return options
        },

        getItemName,
        ...rest,
        ...props,
        selectors: {
            selectDistinctFieldValues: <P extends keyof Attrs>(p: P) => (state:RootState): Item[] => {
                const items = selectAll(state)
                return uniq(items.map(i => i[p]).flat()) as any as Item[]

            },
            selectEntityDigest,
            selectMapByNames,
            selectEq,
            selectEqOne,
            selectById,
            selectAll,
            selectAsMap:  (state: StateWithEntityByEIDAttrs<Attrs,EID>) =>
                state[EID].entities,
            selectEntities:  (state: StateWithEntityByEIDAttrs<Attrs,EID>) =>
                state[EID].entities,
        },
        slice,
        reducer: slice.reducer,
        actions: slice.actions
    }

        type Result = typeof result

        return {
            ...result,
            extend: (builder: <Ex>(result: Result) => Ex) => {
                return builder(result)
            }
        }
}

type SliceActions<T> = {
    [K in keyof T]: {type: K; payload: T[K] extends (...args: infer P) => void ? P[0] : never};
}[keyof T]

class Clazz<Attrs extends AnyAttributes,EID extends string = string>{
    public create = (rid: EID, props: Attrs, opts: EntityOptions<Attrs>)=> {
        return createEntitySlice(rid,props, opts)
    }
}
export {AnyAttributes}
export type ExtractVOByEntitySlice<R extends EntitySlice> = R['exampleItem']

export const toLowerCase = <T extends Uppercase<string>>(str: T): Lowercase<T> =>
    str.toLowerCase() as any as Lowercase<T>

export const toUpperCase = <T extends Lowercase<string>>(str: T): Uppercase<T> =>
    str.toLowerCase() as any as Uppercase<T>


export {
    ItemByAttrs
}
export type GenericEntitySlice = Return<typeof createEntitySlice>
export type EntitySlice<Attrs extends AnyAttributes = AnyAttributes,EID extends string = string > = Return<Clazz<Attrs,EID>['create']>
