import {Meta, valueTypes} from './valueTypes'
import {createCRUDDuck} from '@sha/fsa'
import {Crud} from '@sha/fsa/src/createCRUDDuck'
import {ResourceType} from '../resourcesList'
import {getStore} from '../../../getStore'
import {ISOState} from '../../../ISOState'
import {ColDef} from 'ag-grid-community'

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

export type ResourceOptions<RID extends string, Fields extends AnyFields> = {
    nameProp: keyof Fields
    langRU: ResourceLang
    getItemName: (item: FieldsWithID<RID, Fields>) => string
}

export type ExtractVOFromFields<Fields extends {[key in string]: Meta}> = {
    [K in keyof Fields]:Fields[K]['tsType']
}

export type FieldsWithID<RID extends string, Fields extends AnyFields> =
    Fields & {
    [key in `${RID}Id`]: ReturnType<typeof valueTypes.string>
}

const getResourceOptions = (res: ResourceType) => {

}

export type ItemWithId<RID extends string, Fields extends AnyFields> =
    {[K in keyof FieldsWithID<RID, Fields>]: FieldsWithID<RID, Fields>[K]['tsType']}

export type Resource<RID extends string, Fields extends {[key in string]: Meta}>  =
  ResourceOptions<RID, Fields> & {
    collection: PluralEngindEng<RID>
    exampleItem: ExtractVOFromFields<FieldsWithID<RID,Fields>>
    properties:FieldsWithID<RID, Fields>
    getItemName: (item: ExtractVOFromFields<FieldsWithID<RID,Fields>> ) => string
    getStore: typeof getStore
    asOptions: () => {value: string, title: string}[]
    getById: () => {value: string, title: string}[]
    fieldsList: Meta[]
} & Crud<ExtractVOFromFields<Fields >, IDProp<RID>, PluralEngindEng<RID>>

export type AnyMeta = Meta<any, any>
export type IDProp<RID extends string> = `${RID}Id`
export type AnyFields = {
    [key in string]: Meta
}




export const createResource = <RID extends string, Fields extends AnyFields>
    (RID: RID, properties: Fields,{langRU, ...rest}: ResourceOptions<RID, Fields>): Resource<RID, FieldsWithID<RID,Fields>> => {
        type Item = ExtractVOFromFields<FieldsWithID<RID,Fields>>
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
        const defaultGetItemName = ( (item: Item): string => item[fieldsList[1].name] as string)
        const getItemName = rest.getItemName || defaultGetItemName
        const crud = createCRUDDuck(props.collection,props.idProp, {} as any as ExtractVOFromFields<FieldsWithID<RID,Fields>>)


        return {
            fieldsList,
            ...crud,
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
            asValueEnum: () => {
                const state = getStore().getState()
                const list = crud.selectList( state as any as ISOState)
                const obj = {}
                console.log(crud.factoryPrefix+' list of ' + crud.factoryPrefix,list)
                const options = list.map( item => {
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
            obj: valueTypes.item<{b: string}>({headerName:'вфеф'})
        },
        {
            nameProp:'brandName',
            langRU: {

                singular: 'заказчик',
                some: 'заказчиков',
                plural: 'заказчики',
}},


        )

const b : typeof TEST_RESOURCE.exampleItem = {brandName: '',obj: {b:4},testId:'sds'}

class Clazz<RID extends string, Fields extends {[key in string]: Meta}>{
    public create = (rid: RID, props: Fields, opts: ResourceOptions)=> {
        return createResource(rid,props, opts)
    }
}

export type ExtractVOByResource<R extends Resource<any, any>> = R['exampleItem']

export type ExtractResource<RID extends string, Fields extends {[key in string]: Meta}> = ReturnType<Clazz<RID, Fields>['create']>