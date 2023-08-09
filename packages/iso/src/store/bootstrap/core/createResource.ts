import {Meta, valueTypes} from './valueTypes'
import {createCRUDDuck} from '@sha/fsa'
import {Crud} from '@sha/fsa/src/createCRUDDuck'
import {getStore} from '../../../getStore'
import {ISOState} from '../../../ISOState'
import {ColDef} from 'ag-grid-community'
import {ValuesType} from 'utility-types'

export type PluralEngindEng<S extends string> = S extends `${string}s` ? `${S}es` :  `${S}s`

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
    nameProp: keyof Fields
    langRU: ResourceLang

    getItemName: (item: ItemWithId<RID, Fields>) => string
}



export type FieldsWithIDMeta<RID extends string, Fields extends AnyFieldsMeta> =
    Fields & {
    [key in `${RID}Id`]: Meta<'string',string>
}


export type ItemWithId<RID extends string, Fields extends AnyFieldsMeta> =
    {
        [K in keyof Fields]: Fields[K]['tsType']
    }&{
    [key in `${RID}Id`]: Meta<'string',string>['tsType']

    }

export type Resource<RID extends string, Fields extends {[key in string]: Meta}>  =
  ResourceOptions<RID, Fields> & {
    rid: RID,
    fields: Fields
    collection: PluralEngindEng<RID>
    exampleItem: ItemWithId<RID,Fields>
    properties:FieldsWithIDMeta<RID, Fields>
    getItemName: (item: ItemWithId<RID,Fields> ) => string
    getStore: typeof getStore
    asOptions: () => {value: string, title: string}[]
    asValueEnum: (list?: ItemWithId<RID,Fields>[]) => Record<string, string>
    getById: () => {value: string, title: string}[]
    fieldsList: Array<ValuesType<Fields>>
    resourceName: Uppercase<PluralEngindEng<RID>>
} & Crud<ItemWithId<RID,Fields >, IDProp<RID>, PluralEngindEng<RID>>

export type AnyMeta = Meta<any, any>
export type IDProp<RID extends string> = `${RID}Id`
export type AnyFieldsMeta = {
    [key in string]: Meta
}




export const createResource = <RID extends string, Fields extends AnyFieldsMeta>
    (RID: RID, properties: Fields,{langRU, ...rest}: ResourceOptions<RID, Fields>): Resource<RID, FieldsWithIDMeta<RID,Fields>> => {
        type Item = ItemWithId<RID,Fields>
        const collection: PluralEngindEng<RID> = pluralEngindEnd(RID)
        const idProp = RID+'Id' as `${RID}Id`
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
        const fieldsList:Meta[]  = []
        Object.keys(props.properties).forEach( k => {
            fieldsList.push(props.properties[k])
            props.properties[k].name = k
        })
        const defaultGetItemName =  (item: Item): string => item[fieldsList[1].name] as string
        const getItemName = rest.getItemName || defaultGetItemName
        const crud = createCRUDDuck(props.collection,props.idProp, {} as any as ItemWithId<RID,Fields>)


        return {
            rid: RID,
            fieldsList,
            ...crud,
            fields: properties,
            asOptions: () => {
                const store = getStore()
                const state = store.getState()
                const list = crud.selectList(state as any as ISOState)
                const options = list.map( item => ({
                    value: item[idProp],
                    title: getItemName(item as any as Item),

                }))
                console.log('asOptions', options)
                return options
            },
            selectFirstByName: (name: string) => (state: ISOState) => {
                const list = crud.selectList(state)
                return list.find(item => getItemName(item) === name)
            },
            resourceName: collection.toUpperCase() as any as Uppercase<PluralEngindEng<RID>>,
            asValueEnum: (list: Item[] = undefined) => {
                const state = getStore().getState()
                const workList =list || crud.selectList( state as any as ISOState)
                const obj: Item = {} as any as Item
                console.log(crud.factoryPrefix+' list of ' + crud.factoryPrefix,list)
                const options = workList.map( item => {
                    console.log('item',item)
                    obj[item[idProp]] = getItemName(item)
                })

                console.log('asValueEnum', obj)
                return obj
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