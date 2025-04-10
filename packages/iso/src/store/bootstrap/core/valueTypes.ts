import {DateRangeVO} from './VO'
import {ResourceName} from '../resourcesList'
import {ColDef} from "ag-grid-community";
import {AnyFieldsMeta, ItemWithoutId} from "./createResource";
import {mapObjIndexed} from "ramda";

export const cast = <T>(value: any): T => value
export type MetaType =
    | 'string'
    | 'text'
    | 'boolean'
    | 'number'
    | 'int'
    | 'uint'
    | 'array'
    | 'arrayOf'
    | 'itemOf'
    | 'item'
    | 'any'
    | 'datetime'
    | 'date'
    | 'timestamp'
    | 'daterange'
    | 'enum'

type UnionToIntersection<U> =
    (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never
type LastOf<T> =
    UnionToIntersection<T extends any ? () => T : never> extends () => (infer R) ? R : never

// TS4.0+
type Push<T extends any[], V> = [...T, V];

// TS4.1+
type TuplifyUnion<T, L = LastOf<T>, N = [T] extends [never] ? true : false> =
    true extends N ? [] : Push<TuplifyUnion<Exclude<T, L>>, L>

export type Meta<MT extends MetaType, TSType = any> = {
    type?: MT
    toLowerCase?: boolean
    properties?: AnyFieldsMeta
    immutable?: boolean
    isIDProp?: boolean
    unique?: boolean
    saveModificationDate?: boolean
    rules?: Array<any>
    required?: boolean
    headerName?: string
    tsType?: TSType
    sealed?: boolean
    name?: string
    colDef?: ColDef | false
    select?: boolean
    internal?: boolean
            llinkedResourceName?: string
    defaultByLink?: {
        linkPropName: string
        targetProp: string
    }
}

export type ExtractTypeByPropMeta<M> = M extends Meta<infer S, infer T> ? T : unknown

export type Empty = {}

const meta = <TS = string,  MT extends MetaType = MetaType, E1 = Empty>(type:MT) =>Object.assign((
    <Extra>(extra: Meta<MT, TS> = {}) =>
        ({ type, tsType: {} as any as TS,name: 'string' as string, ...extra})
),{type})


const addKeyNameToProperty = <Fields extends AnyFieldsMeta>(prop: Meta<any, any>, key: keyof Fields) => ({...prop, name: key})

const addNamesTOProps = mapObjIndexed(addKeyNameToProperty);
const arrayMeta = <Fields extends AnyFieldsMeta, Extra = Empty>(extra: Partial<Meta<'array', ItemWithoutId<Fields>[]>> & Partial<Extra>  & {properties: Fields}) =>
    ({...extra, type:'array',properties: addNamesTOProps(extra.properties) as any as Fields, tsType: {} as any as ItemWithoutId<Fields>[]}) as ArrayMeta<Fields>

export type ArrayMeta<Fields extends AnyFieldsMeta> = Meta<'array', ItemWithoutId<Fields>[]> & {properties: Fields}
export const isArrayMeta = (value: AnyMeta): value is ArrayMeta<any> => {
    if(value.type === 'array')
        return true
    return false
}
const itemMeta = <Item, Extra = Empty>(extra: Partial<Meta<'item', Item>> ) =>
    ({...extra, type: 'item'})



const itemOfMeta = <K extends ResourceName>(extra: Meta<'itemOf', string> &{
    linkedResourceName: K, defaultAsPropRef?: string, filterLinkedResourceItems?: Function,} ) =>
    ({...extra,type: 'itemOf'}) as  Meta<'itemOf', string> &{
        linkedResourceName: K, defaultAsPropRef?: string, filterLinkedResourceItems?: Function,}


const dateMeta = (extra: Meta<'date', string> ) =>
    ({
        ...extra,type: 'date'
    })

const arrayOfMeta = <Extra extends {linkedResourceName: ResourceName}>(extra: Partial<Meta<'arrayOf', string[]>> & Extra ) =>
    ({...extra, type: 'arrayOf'})

export type TupleElement = string

const enumMeta = <Tuple extends TupleElement[]>(extra: Partial<Meta<'enum', Tuple[number]>> & {enum: Readonly<[...Tuple]>, customOptions?: Readonly<{ label: string; value: string; }[]>} ) =>
    ({...extra, type: 'enum' as 'enum'}) as Meta<'enum', Tuple[number]> & {enum: Readonly<[...Tuple]>, customOptions?: Readonly<{ label: string; value: string; }[]>}

export type EnumMeta = ReturnType<typeof enumMeta>
export type InferredVOByMetaMap<P extends {[key in string]: PropMetas}> = Readonly<{
    [K in keyof P]: P[K]
}>

export type ValueTypeProp = {}

export type ValueTypesType = typeof valueTypes
export type KeyOfValueTypes = keyof ValueTypesType

export type PropMetas = {
    [K in keyof ValueTypesType]: ReturnType<ValueTypesType[K]>
}

const buildMetaFactory =<MType extends MetaType, TSType = string>()=> {

}
export type StringMeta = Meta<'string',string> & {toLowerCase?: boolean}

export type ItemOfMeta= ReturnType<typeof itemOfMeta >

export type DateMeta= ReturnType<typeof dateMeta >
/*Meta<'itemOf', string> & {
    linkedResourceName: ResName
}
*/
export const isEnumMeta = (value: unknown): value is EnumMeta =>
    value && (value as any).type === 'enum'
export const isItemOfMeta = (value: unknown): value is ItemOfMeta =>
    value && (value as any).type === 'itemOf'

const valueTypes = {
    date: dateMeta,
    text: meta<string>('text'),
    string: meta<string>('string'),
    enum: enumMeta,
    boolean: meta<boolean>('boolean'),
    number: meta<number>('number'),
    int: meta<number>('int'),
    item: itemMeta,
    any: meta<any>('any'),
    uint: meta<number>('uint'),
    array: arrayMeta,
    arrayOf: arrayOfMeta,
    itemOf: itemOfMeta,
    datetime: meta<string>('datetime'),
    timestamp: meta<number>('timestamp'),
    daterange: meta<DateRangeVO>('daterange'),
}
const valueTypesMetas = [
    valueTypes.date({}),
    valueTypes.string({})
]

type ValueTypes = typeof valueTypesMetas[number]
export type AnyMeta =ArrayMeta<any>|EnumMeta | Meta<'string', string> | Meta<'date', string> | ItemOfMeta | Meta<'number', number>| Meta<'text', number>| Meta<'boolean', number>
//const m: AnyMeta =
export {
    valueTypes
}
