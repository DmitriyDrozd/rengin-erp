import {Meta, MetaType, valueTypes} from './valueTypes'
import {createCRUDDuck} from '@sha/fsa'
import {Crud} from '@sha/fsa/src/createCRUDDuck'
import {getStore} from '../../../getStore'

export type PluralEngindEng<S extends string> = S 

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
    indexes?: Exclude<keyof Fields,`${RID}Id`>[],
    getItemName?: (item: ItemWithId<RID, Fields>) => string
}



export type FieldsWithIDMeta<RID extends string, Fields extends AnyFieldsMeta> =
    Fields & {
    [key in `${RID}Id`]: Meta<MetaType,string>
}
export type IdKey<RID extends string>= `${RID}Id`

export type WithOnlyId<RID extends string> = {[K in IdKey<RID>]: string}

export type ItemWithId<RID extends string, Fields extends AnyFieldsMeta> =
    {
        [K in Exclude<keyof Fields,IdKey<RID>>]: Fields[K]['tsType'] | undefined
    } & WithOnlyId<RID>

export type Resource<RID extends string, Fields extends {[key in string]: Meta}>  =
  ResourceOptions<RID, Fields> & {
    rid: RID,
    fields: Fields
    selectFirstByName: (name: string) => (state) => ItemWithId<RID, Fields>
    collection: PluralEngindEng<RID>
    exampleItem: ItemWithId<RID,Fields>
    properties:FieldsWithIDMeta<RID, Fields>
    getItemName: (item: ItemWithId<RID,Fields> ) => string
    getStore: typeof getStore
    asOptions: (list?: ItemWithId<RID,Fields>[]) => Array<{value: string, title: string}>
    asValueEnum: (list?: ItemWithId<RID,Fields>[]) => Record<string, string>
    fieldsList: (Meta & {name: string})[]
    resourceName: Uppercase<PluralEngindEng<RID>>
} & Crud<ItemWithId<RID,Fields >, IdKey<RID>, PluralEngindEng<RID>>

export type AnyMeta = Meta<any, any>
export type AnyFieldsMeta = {
    [key in string]: Meta
}




export const createResource = <RID extends string, Fields extends AnyFieldsMeta>
    (RID: RID, properties: Fields,{langRU, ...rest}: ResourceOptions<RID, Fields>): Resource<RID, FieldsWithIDMeta<RID,Fields>> => {
        type Item = ItemWithId<RID,Fields>
        const collection: PluralEngindEng<RID> = pluralEngindEnd(RID)
        const idProp = RID+'Id' as IdKey<RID>
        type IDProp = IdKey<RID>
        const props = {
            langRU,
            RID,
            idProp,
            collection,
            properties: {
                [idProp]: valueTypes.string({headerName: langRU.singular,isIDProp: true,unique: true}),
                ...properties,
                removed: valueTypes.string({headerName: 'Удалёно',sealed:true}),
            },
            exampleItem: {} as any as Item
        }
        const fieldsList:(Meta & {name: string})[]  = []
        Object.keys(props.properties).forEach( k => {
            fieldsList.push(props.properties[k])
            props.properties[k].name = k
        })
        const defaultGetItemName =  ((item: Item): string => {
            const i = item
            const propName =fieldsList[1].name
           return i[propName] as string
        }) as any
        const getItemName = rest.getItemName || defaultGetItemName
        const crud = createCRUDDuck<Item,IDProp,PluralEngindEng<RID>>(collection, idProp,rest.indexes)


        return {
            rid: RID,
            fieldsList,
            ...crud,
            fields: properties,
            asOptions: (init: Item[] = undefined) => {
                const store = getStore()
                const state = store.getState()
                const list = init || crud.selectList(state as any)
                const options = list.map( item => ({
                    value: item[idProp],
                    label: getItemName(item as any as Item),
                }))
                console.log('asOptions', options)
                return options
            },
            selectFirstByName: (name: string) => (state) => {
                const list = crud.selectList(state)
                return list.find(item => getItemName(item) === name)
            },
            resourceName: collection.toUpperCase() as any as Uppercase<PluralEngindEng<RID>>,
            asValueEnum: (list: Item[] = undefined) => {
                const state = getStore().getState()
                const workList =list || crud.selectList( state as any)
                const options: Record<string, string> = {}
                console.log(crud.factoryPrefix+' list of ' + crud.factoryPrefix,list)
                workList.map( item => {
                    console.log('item',item)
                    options[item[idProp]] = getItemName(item)
                })

                console.log('asValueEnum', options)
                return options
            },
            getItemName,
            ...rest,
            ...props,

            getStore,
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

class Clazz<RID extends string, Fields extends {[key in string]: Meta}>{
    public create = (rid: RID, props: Fields, opts: ResourceOptions<RID ,Fields>)=> {
        return createResource(rid,props, opts)
    }
}

export type ExtractVOByResource<R extends Resource<any, any>> = R['exampleItem']

export type ExtractResource<RID extends string, Fields extends {[key in string]: Meta}> = ReturnType<Clazz<RID, Fields>['create']>