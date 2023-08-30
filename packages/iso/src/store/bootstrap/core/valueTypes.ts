import {DateRangeVO} from './VO'
import { ResourceName, ResourcesMap} from '../resourcesList'
import {AnyMeta} from './createResource'


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


export type Meta<MT extends MetaType = 'string', TSType = any> = {
    type: MT
    immutable?: boolean
    isIDProp?: boolean
    unique?: boolean
    saveModificationDate?: boolean
    rules?: Array<any>
    required?: boolean
    headerName?: string
    tsType: TSType
    sealed?: boolean
    name?: string
}

export type ExtractTypeByPropMeta<M> = M extends Meta<infer S, infer T> ? T : unknown


export type Empty = {}
const meta = <TS = string,  MT extends MetaType = MetaType, E1 = Empty>(type:MT) =>Object.assign((

    <Extra>(extra: Partial<Meta<MT, TS>> & Partial<Extra> & Partial<E1> = {}) =>
        ({...extra, type, tsType: {} as any as TS})
),{type})


const arrayMeta =  <Item = any, Extra = Empty>(extra: Partial<Meta<'array', Item[]>> & Partial<Extra> = {}) =>
    ({...extra, type:'array'})

const itemMeta = <Item, Extra = Empty>(extra: Partial<Meta<'item', Item>> ) =>
    ({...extra, type: 'item'})



const itemOfMeta = <K extends ResourceName, Extra = Empty>(extra: Meta<'itemOf', string> &{
    linkedResourceName: K} & Extra ) =>
    ({
        ...extra,type: 'itemOf'})


const arrayOfMeta = <Extra extends {linkedResourceName: ResourceName}>(extra: Partial<Meta<'arrayOf', string[]>> & Extra ) =>
    ({...extra, type: 'arrayOf'})

const enumMeta = <Tuple extends Readonly<string[]>,Element = Tuple[number]>(extra: Partial<Meta<'enum', Element>> & {enum: Tuple} ) =>
    ({...extra, type: 'enum' as 'enum'})as Meta<'enum',Tuple[number]>

export type InferredVOByMetaMap<P extends {[key in string]: PropMetas}> = Readonly<{
    [K in keyof P]: P[K]
}>

export type ValueTypeProp = {}

export type ValueTypesType = typeof valueTypes
export type KeyOfValueTypes = keyof ValueTypesType

export type PropMetas = {
    [K in keyof ValueTypesType]: ReturnType<ValueTypesType[K]>
}

export type StringMeta = Meta<'string',string>

export type ItemOfMeta<ResName extends ResourceName = ResourceName> = Meta<'itemOf', string> & {
    linkedResourceName: ResName
}

export const isItemOfMeta = (value: unknown): value is ItemOfMeta =>
    value && (value as any).type === 'itemOf'

const valueTypes = {
    date: meta<string>('date'),
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


const d = valueTypes.number({min: '435'})


export type WithKey<Path extends string, T = string> = { [K in Path]: T }

export {
    valueTypes
}
