import {ColDef} from "ag-grid-community"
import {mapObjIndexed} from "ramda"
import {EmptyObject, generateGuid, Tagged} from "@shammasov/utils";
import {CamelCase} from "type-fest";

export const commonAttrs = <EID extends string>(eid:EID) => ({
    id: AttrFactories_ex.string({headerName: 'ID', default: () => generateGuid(),isIDProp: true,unique: true, colDef:false}) as AttrMeta<'string', TaggedID<EID>>,
    removed: AttrFactories_ex.boolean({select: false, colDef: false}),
    addedAtTS: AttrFactories_ex.timestamp({headerName:'Добавлен', default: () => new Date().getTime()})
})
export type CommonAttrs<EID extends string> = {
    id: AttrMeta<'string', TaggedID<EID>>
    removed: AttrMeta<'boolean'>
    addedAtTs: AttrMeta<'timestamp'>
}

export type _AttrMetaCommonExtra = {
    required?:boolean
    immutable?:boolean
    unique?: boolean
    headerName?: string
    sealed?: boolean
    colDef?: ColDef | false
    internal?: boolean
}
export type AttrMetaDefault<TSType = any> = {(): TSType} | TSType
// export type AttrMetaDefault<TSType = any, Attrs extends AnyAttributes = AnyAttributes> = {
//     (item: Partial<ItemByAttrs<Attrs,EID>>): TSType
// }  | {(): TSType} | TSType
type _AttrMeta<MT extends string, TSType = any,> = {
    type?: MT

    tsType?: TSType
    name?: string
    default?:AttrMetaDefault<TSType>
} & _AttrMetaCommonExtra

export type CommonAttrExtra = {
    colDef?: ColDef | false
}
export type AttrMeta<FT extends AnyAttrType, TSType = ValueTypeByAttrType<FT>> = _AttrMeta<FT,TSType>

export type ExtractTypeByPropMeta<M> = M extends _AttrMeta<infer S, infer T> ? T : unknown

export type Empty = Record<string, never>

const attrFactory = <TS = string, Extra extends _AttrMetaCommonExtra = _AttrMetaCommonExtra>(defaultExtra: Partial<Extra>  = {}) =>
    <FT extends string>(type:FT) =>Object.assign((
    <Extra>(extra: Partial<_AttrMeta<FT, TS>> & Partial<Extra> = {}) =>
        ({...defaultExtra, ...extra, type, tsType: {} as any as TS})
),{defaultExtra:defaultExtra}, {type})



const addKeyNameToProperty = <Attrs extends {[key: string]: AttrMeta<any>}>(prop: _AttrMeta<any, any>, key: keyof Attrs, obj: Attrs) => ({...prop, name: key})

const arrayMeta = <Attrs extends EmpheralAttributes ,EID extends string, Extra = Empty>(extra: Partial<_AttrMeta<'array', ItemByAttrs<Attrs,EID>[]>> & Partial<Extra> & {attributes: Attrs} ) =>
    ({...extra, type:'array',attributes: mapObjIndexed(addKeyNameToProperty as any,extra.attributes||{}), tsType: {} as any as Array<ItemByAttrs<Attrs,EID>>}) as any as  AttrMeta<'array', ItemByAttrs<Attrs,EID>[]>

const itemMeta = <Item>(extra: Partial<_AttrMeta<'item', Item>> ) =>
    ({...extra, type: 'item'}) as _AttrMeta<'item', Item>


const itemOfAttr = <L extends string>(extra: _AttrMeta<'itemOf', string> & {
    linkedEID: L, defaultAsPropRef?: string, filterLinkedResourceItems?: Function} ) =>
    ({
        ...extra,
        tsType: 'string' as const,
        type: 'itemOf' as const
    })

const arrayOfAttr = <L extends string, EID extends string, Extra = EmptyObject>(extra: Partial<_AttrMeta<'arrayOf', Tagged<IdTagType<L>>[]>> & Extra & {
    linkedEID: L, defaultAsPropRef?: string, filterLinkedResourceItems?: Function}  ) =>
    ({...extra, type: 'arrayOf' as const, tsType: [] as any as string[]})

export type TupleElement = string | number | boolean | undefined | null | void | {};

const enumAttr = <Tuple extends any[]>(extra: Partial<_AttrMeta<'enum', Tuple[keyof Tuple]>> & {enum: Readonly<[...Tuple]>} ) =>
    ({...extra, type: 'enum' as 'enum',tsType:{} as any as Tuple[number]})

export type EnumAttr = ReturnType<typeof enumAttr>
export type InferredVOByMetaMap<P extends {[key in string]: PropMetas}> = Readonly<{
    [K in keyof P]: P[K]
}>


export type ValueTypesType = typeof AttrFactories_ex
export type KeyOfValueTypes = keyof ValueTypesType

export type PropMetas = {
    [K in keyof ValueTypesType]: ReturnType<ValueTypesType[K]>
}

export type StringMeta = _AttrMeta<'string',string>

export type ItemOfAttr<EID extends string= string> = _AttrMeta<'itemOf', TaggedID<EID>> & {
    linkedEID: EID
}

export const isItemOfAttr = (value: unknown): value is ItemOfAttr =>
    !!value && (value as any).type === 'itemOf'

export const isEnumAttr = (value: unknown): value is EnumAttr =>
    !!value && (value as any).type === 'enum'


const AttrFactories_ex = {

    //idMeta: meta<string, 'id'>('id'),
    date: attrFactory<string>()('date'),
    text: attrFactory<string>()('text'),
    string: attrFactory<string>()('string'),
    image: attrFactory<string>()('image'),
    enum: enumAttr,
    boolean: attrFactory<boolean>()('boolean'),
    number: attrFactory<number>()('number'),
    int: attrFactory<number>()('int'),
    item: itemMeta,
    any: attrFactory<any>()('any'),
    uint: attrFactory<number>()('uint'),
    array: arrayMeta,
    arrayOf: arrayOfAttr,
    itemOf: itemOfAttr,
    datetime: attrFactory<string>()('datetime'),
    timestamp: attrFactory<number>()('timestamp'),

}

const AttrFactories_ex_EXA = {

    //idMeta: meta<string, 'id'>('id'),
    date: AttrFactories_ex.date(),
    text: AttrFactories_ex.text(),
    string: AttrFactories_ex.string(),
    image: AttrFactories_ex.image(),
    enum: AttrFactories_ex.enum({enum:['']}),
    boolean: AttrFactories_ex.boolean(),
    number:AttrFactories_ex.number(),
    int: AttrFactories_ex.int(),
    datetime: AttrFactories_ex.datetime(),
    timestamp: AttrFactories_ex.timestamp(),

    any: AttrFactories_ex.any(),
    uint: AttrFactories_ex.uint(),

    item:AttrFactories_ex.item({}),
     array: AttrFactories_ex.array({attributes:{}}),
     arrayOf: AttrFactories_ex.arrayOf({linkedEID:''}),
     itemOf: AttrFactories_ex.itemOf({linkedEID:''}),
}
AttrFactories_ex_EXA.arrayOf.type='arrayOf'

export type AttrFactoriesMap = typeof AttrFactories_ex
export type AnyAttrType = keyof AttrFactoriesMap
export type AnyAttrBuilder = AttrFactoriesMap[AnyAttrType]

export type AttrMetaByAttrType<FT extends AnyAttrType>= ReturnType<AttrFactoriesMap[FT]>
export type ValueTypeByAttrType<FT>= FT extends   AnyAttrType
    ? AttrMetaByAttrType<FT>['tsType']
    : unknown
 //type _AnyAttr = typeof AttrFactories_ex_EXA[keyof typeof AttrFactories_ex_EXA]
export type AnyAttr =  typeof AttrFactories_ex_EXA[keyof typeof AttrFactories_ex_EXA]
var a = {} as any as AnyAttr
a.type='itemOf'
var b = {} as any as AttrMetaByAttrType<typeof a.type>
b.linkedEID
export {
    AttrFactories_ex
}
export type EmpheralAttributes = {[key: string]: AttrMeta<any>}

export type AnyAttributes<EID extends string = string> =  EmpheralAttributes & Partial<CommonAttrs<EID>>

export type IdTagType<EID extends string>= CamelCase<EID> extends `${infer Singular}es`
    ? `${Singular}Id`
    :CamelCase<EID> extends `${infer Singular}s`
        ? `${Singular}Id`
        : `${CamelCase<EID>}Id`
export type TaggedID<EID extends string> = Tagged<IdTagType<EID>>
export type IdAttrByEID<EID extends string = string> =    AttrMeta<'string', TaggedID<EID>>

export type ItemCommon<EID extends string = string> =ItemWithoutId< CommonAttrs<EID>>

export type ItemByAttrs<Attrs extends EmpheralAttributes,EID extends string = string> = ItemWithoutId<Attrs> & ItemCommon<EID>

export type ItemWithoutId<Attrs extends EmpheralAttributes> = {
    [K in keyof Attrs]: Attrs[K]['tsType']
}
//export type AnyAttrType = typeof AttrFactories_ex[keyof typeof AttrFactories_ex]['type']
