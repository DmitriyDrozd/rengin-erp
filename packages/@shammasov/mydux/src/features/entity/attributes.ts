import {mapObjIndexed} from "ramda";

export type Empty = Record<string, never> & {a: 4}
const a = {} as any as Empty



const builder = <B extends {[x:string]: any}>(result: B = {} as B) => {

    type Initialize = {(options:B): B}

    const set = <O extends Partial<B>>(patch: O) =>
        builder<B>({...result, ...patch})

    const assign = <O extends { [x: string]: any }>(obj:O) =>
        builder<Omit<B, keyof O> & O>({...result, ...obj})

    const add = <K extends string, V>(key: K, value: V) =>
        assign({[key]: value} as { [k in K]: V })


    return Object.assign(
        ( (options: B) => {
            return assign(options)
        }),
        {
            set,
            add,
            assign,
            result,
            ...result
        }
    )
}

export type _AttrMetaCommonExtra = {
    required?:boolean
    immutable?:boolean
    headerName?: string
    sealed?: boolean

}
const baseAttribute = builder({

} as _AttrMetaCommonExtra)



const attrBuilder =  <T = string>(exampleValue?: T) => builder(({
    tsType: undefined as any as T
}))

const attributeCreatorsRawMap = {
    string: attrBuilder(),
    text: attrBuilder(),
    date: attrBuilder(),
    datetime: attrBuilder(),

    image: attrBuilder(),
    number: attrBuilder<number>(),
    boolean: attrBuilder<number>(),
    uint: attrBuilder<number>(),
    int: attrBuilder<number>(),
    timestamp: attrBuilder<number>(),

    enum: attrBuilder(),
//item: itemMeta,
    any: attrBuilder<any>(),
    //  array: arrayMeta,
    arrayOf: <ReID extends string>(props: {relatedEID: ReID}) => attrBuilder<string[]>().assign(props),
    itemOf: <ReID extends string>(props: {relatedEID: ReID}) => attrBuilder<string>().assign(props),

}
type AttCs = typeof attributeCreatorsRawMap
type AttCsNames = {
    [K in keyof AttCs]: {type: K}& AttCs[K]
}

const attrCreators = mapObjIndexed((b, key,) => ({type: key, ...b}), attributeCreatorsRawMap) as AttCsNames

export type AnyAttrCreator = AttCsNames[keyof AttCsNames]
export { attrCreators}