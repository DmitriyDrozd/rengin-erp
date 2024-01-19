import {ItemOfMeta, Meta, MetaType, StringMeta, valueTypes} from './valueTypes'
import {createCRUDDuck} from '@sha/fsa'
import {Crud} from '@sha/fsa/src/createCRUDDuck'
import {getStore} from '../../../getStore'
import {$Values} from "utility-types";
import {ISOState} from "../../../ISOState";
import {toAssociativeArray} from "@sha/utils";

export type PluralEngindEng<S extends string> = `${S}s`

export const pluralEngindEnd = <S extends string>(singular: S):PluralEngindEng<S> =>
    (singular.slice(-1) === 's' ? singular+'es' : singular+'s') as any as PluralEngindEng<S>

export type ResourceLang = {
    singular: string,
    some: string,
    plural: string,
    name?: string,
    gender?: 'm' | 'n' | 'f',
}

export type ResourceOptions<RID extends string, Fields extends AnyFieldsMeta> = {
    nameProp?: keyof Fields
    langRU: ResourceLang
    getItemName?: (item: ItemWithId<RID, Fields>) => string
}

export type FieldsWithIDMeta<RID extends string, Fields extends AnyFieldsMeta> =
    Fields & {
    [key in `${RID}Id`]: Meta<'string',string>
}
export type IdKey<RID extends string>= `${RID}Id`

export type WithOnlyId<RID extends string> = {[s in `${RID}Id`]: string}

export type ItemWithoutId<Fields extends AnyFieldsMeta> =
    {
        [K in keyof Fields]: Fields[K]['tsType']
    }
export type ItemWithId<RID extends string, Fields extends AnyFieldsMeta> =
    {
        [K in keyof Fields]: Fields[K]['tsType']
    } & WithOnlyId<RID>

export type Resource<RID extends string, Fields extends AnyFieldsMeta>  =
  ResourceOptions<RID, Fields> & {
    idMeta: Meta<'string', string>
    rid: RID,
    fields: Fields
    idProp: IdKey<RID>
    idKey: IdKey<RID>
    selectFirstByName: (name: string) => (state) => ItemWithId<RID, Fields>
    collection: PluralEngindEng<RID>
    exampleItem: ItemWithId<RID,Fields>
    properties:Fields//FieldsWithIDMeta<RID, Fields>
    getStore: typeof getStore
    asOptions: (list?: ItemWithId<RID,Fields>[]) => Array<{value: string, label: string, disabled?: boolean}>
    asValueEnum: (list?: ItemWithId<RID,Fields>[]) => Record<string, string>
    fieldsList:  Meta<MetaType,string>[]
    resourceName: Uppercase<PluralEngindEng<RID>>
    selectMapByNames: (state: ISOState) => Record<string, ItemWithId<RID, Fields>>
} & Crud<ItemWithId<RID,Fields >, IdKey<RID>, PluralEngindEng<RID>>



export type AnyFieldsMeta =  {[key in string]: Meta<any>}

const addProp = <K extends string>(name: K) => <V>(value: V): {} =>({[name]: value})
addProp('a')(5)
export const createResource = <RID extends string,  Fields extends AnyFieldsMeta>
    (RID: RID, properties: Fields,{langRU, ...rest}: ResourceOptions<RID, Fields>) => {
        type Item = ItemWithId<RID,Fields>
        const collection: PluralEngindEng<RID> = pluralEngindEnd(RID)
    type IDProp = IdKey<RID>
        const idPropThis = RID+'Id' as IdKey<RID>

        const propsWithOnlyId: {[ke in IDProp]: StringMeta}= ({

            [idPropThis as IDProp]: valueTypes.string({headerName: 'id',isIDProp: true,unique: true})
        }) as any

        const props = {
            langRU,
            RID,
            idProp: idPropThis,
            collection,
            properties: {
                ...propsWithOnlyId,
                ...properties,
                removed: valueTypes.string({headerName: 'Удалёно',sealed:true}),
            },
            exampleItem: {} as any as Item
        }
        const fieldsList:(Meta<any, any>)[]  = []
        Object.keys(props.properties).forEach( k => {
            const p =props.properties[k]
            fieldsList.push(p)
            p.name = k
            p.headerName = p.headerName || p.name
        })
        const defaultGetItemName =  ((item: Item): string => {
            const i = item
            const propName =fieldsList[1].name
           return i[propName] as string
        }) as any
        const getItemName = rest.getItemName || defaultGetItemName
        const {idProp, ...crud} = createCRUDDuck<Item,IDProp,PluralEngindEng<RID>>(collection, idPropThis)
const selectMapByNames= (state: ISOState) => {
    const list = state.app.bootstrap[props.collection]  as any as Item[]
    return list.reduce((map, item) =>{
        const name =getItemName(item)
        map[name] = item
        if(!item[`${RID}Name`])
            item[`${RID}Name`] = name
        return map
    } ,{} as any as Record<string, Item>)

}
        const result = {
            getPropByName: <K extends keyof ItemWithId<RID, Fields>>(key: K) =>
                properties[key],
            rid: RID,
            idMeta: props.properties[idPropThis],
            fieldsList: fieldsList as   any as $Values<FieldsWithIDMeta<RID, Fields>>[],
            ...crud,
            idProp: idPropThis,
            fields: properties,
            asOptions: (init: Item[] = undefined) => {
                const store = getStore()
                const state = store.getState()
                const list = init || crud.selectList(state as any)
                const options = list.map( item => ({
                    value: String(item[idProp]),
                    label: getItemName(item as any as Item),
                }))
                console.log('asOptions', options)
                return options
            },
            selectFirstByName: (name: string) => (state) => {
                const list = crud.selectList(state)
                return list.find(item => getItemName(item) === name)
            },

            selectMapByNames,
            resourceName: collection.toUpperCase() as any as Uppercase<PluralEngindEng<RID>>,
            asValueEnum: (list: Item[] = undefined) => {
                const state = getStore().getState()
                const workList =list || crud.selectList( state as any)
                const options: Record<string, string> = {}
                console.log(crud.factoryPrefix+' list of ' + crud.factoryPrefix,list)
                workList.map( item => {
                    console.log('item',item)
                    options[String(item[idProp])] = String(getItemName(item))
                })
                console.log('asValueEnum', options)
                return options
            },
            getItemName,
            ...rest,
            ...props,
         getStore: getStore,

        }

        return {
            ...result,
            isResource: <V = unknown>(value: V): value is typeof result =>
                // @ts-ignore
                value.rid === result.rid
        }
}


    const TEST_RESOURCE = createResource('test',
        {
            brandName: valueTypes.string(),
        },
        {

            langRU: {

                singular: 'заказчик',
                some: 'заказчиков',
                plural: 'заказчики',
}},


        )


//export const resourceListAsValueEnum = <RID extends string, Fields extends AnyFieldsMeta>(list: ItemWithId<RID, Fields>[]) =>

const b : typeof TEST_RESOURCE.exampleItem = {brandName: '',testId:'sds'}

class Clazz<RID extends string, Fields extends AnyFieldsMeta>{
    public create = (rid: RID, props: Fields, opts: ResourceOptions<RID ,Fields>)=> {
        return createResource(rid,props, opts)
    }
}

export type ExtractVOByResource<R extends Resource<any, any>> = R['exampleItem']

export type ExtractResource<RID extends string, Fields extends {[key in string]: Meta<MetaType, any>}> = ReturnType<Clazz<RID, Fields>['create']>

export const getResLedger = <RID extends string, Fields extends AnyFieldsMeta, Item extends ItemWithId<RID, Fields> = ItemWithId<RID, Fields>> (res: Resource<RID, Fields>) =>
    (state: ISOState) => {
        const list = res.selectList(state)
        const byId = toAssociativeArray(res.idProp)(list)
        const byName = res.selectMapByNames(state)
        const maps: LinkedProps<RID,Fields> = {} as any
        const indexMapByProp = (p: ItemOfMeta) => {
            const map: Record<string, Item[]> = {}
            list.forEach( (item) => {
                if(!map[item[p.name]])
                    map[item[p.name]]= []
                map[item[p.name]].push(item)
            })
        }
        return {
            list, byId, byName, byRes: <K extends keyof LinkedProps<RID,Fields>>(key:K)=> {
                if(!maps[key])
                    maps[key] = indexMapByProp(res.properties[key])
                return linkedId =>
                    maps[key][linkedId] || []

            }
        }
    }
export type LinkedProps<RID extends string, Fields extends AnyFieldsMeta> =Extract<keyof Fields,`${string}Id`>
