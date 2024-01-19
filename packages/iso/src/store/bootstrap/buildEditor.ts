import {AnyFieldsMeta, ItemWithId, ItemWithoutId, Resource} from "./core/createResource"
import {optionsFromValuesList, RenSelectOption} from "front/src/components/form/RenFormSelect"
import {AnyMeta, EnumMeta, isEnumMeta, isItemOfMeta, ItemOfMeta} from "./core/valueTypes"
import {ISOState} from "../../ISOState"
import {RESOURCES_MAP} from "./resourcesList"
import {mergeDeepRight} from "ramda";
import BRANDS from "./repos/brands";
import {USERS} from "./repos/users";

export type GetParamsByMeta<M extends AnyMeta> = M extends EnumMeta
    ? ParamsEnumMeta
    : M extends ItemOfMeta
        ? ParamsItemOfMeta
        : ParamsDefaultMeta

export type ParamsItemOfMeta = {
    disabled?: boolean
    options: RenSelectOption[]
    addNewItemDefaults?: any
}
export type ParamsEnumMeta = {
    disabled?: boolean
    options: RenSelectOption[]
}
export type ParamsDefaultMeta = {
    disabled?: boolean

}


export type ResourceParts<Res = any> = Res extends {rid: infer RID, properties: infer Fields}
    ?RID extends string
        ? Fields extends AnyFieldsMeta
            ? {
            Resource: Res
            Params: Partial<{[k in keyof Fields]: GetParamsByMeta<Fields[k]>}>
            Errors: Partial<{[k in keyof Fields]: string}>
            Fields: Fields
            RID: RID
            Item: ItemWithId<RID, Fields>
            ItemFields: ItemWithoutId<Fields>
        } & Resource< RID,  Fields>
            : never
        :never
    :never

export type RuleArguments<RID extends string, Fields extends AnyFieldsMeta, K extends keyof Resource<RID, Fields>['properties']> = {
    value: ItemWithId<RID, Fields>[K]
    propertyName: K
    item: ItemWithId<RID, Fields>,
    property: Fields[K]
    state: ISOState
    role: typeof USERS.properties.role.enum[number]
    currentUserId: string
}

type PropertyUpdater< Fields extends AnyFieldsMeta,
    K extends keyof Fields,
    RID extends string = string > =
    (args: RuleArguments<RID, Fields, K>) =>  ItemWithId<RID, Fields>//<RID, F>

type PropertyGetParams <Fields extends AnyFieldsMeta,  K extends keyof Resource<RID, Fields>['properties'],RID extends string = string> =
    (args: RuleArguments<RID,Fields, K>) =>
        GetParamsByMeta<Resource<RID, Fields>['properties'][K]>

type PropertyGetErrors < Fields extends AnyFieldsMeta,
    K extends keyof Fields,
    RID extends string = string >=
    (args: RuleArguments<RID, Fields, K>)   => string | undefined

export type PropRule< Fields extends AnyFieldsMeta, K extends keyof Resource<RID, Fields>['properties'],RID extends string = string> = Partial<{
    getUpdate: PropertyUpdater<Fields, K ,RID >
    getParams: PropertyGetParams<Fields, K,RID>
    getErrors: PropertyGetErrors<Fields, K,RID >
}>
type A = ItemWithId<string, typeof BRANDS.properties>

export type Rules <RID extends string, Fields extends AnyFieldsMeta>= {
    [K in keyof Fields]:PropRule<Fields, K,RID >
}


export const buildEditor = <RID extends string,
    Fields extends AnyFieldsMeta
>(resource: Resource<RID, Fields>, mergeRules: Partial<Rules<RID, Fields>>) => {
   type Res = Resource<RID, Fields>
    type Item =  ItemWithId<RID, Fields>
    type Parts = ResourceParts<Res>
    const idKey = resource.idKey
    const rulesObj: Record<string, PropRule<Fields, keyof Fields,RID>> = {} as any
    resource.fieldsList.forEach( prop => {
        rulesObj[prop.name!] = {
            getParams: ({value, item, property, state}) => {
                const meta = property
                if(isItemOfMeta(meta)) {
                    const connectedRes = RESOURCES_MAP[meta.linkedResourceName]
                    return {
                        options: connectedRes.asOptions(
                            connectedRes.selectAll(state) as any[]
                        )
                    }
                }
                if(isEnumMeta(meta)) {
                    return {options:  optionsFromValuesList(meta.enum)}
                }
                return {} as any
            },
            getUpdate: ({value, item, property, state}) => ({
                ...item , [property!.name!]:value,
            }),
            getErrors: ({value, item, property, state}) => {
                if(property.required && value=== undefined)
                    return 'Не может быть пустым'
                if(property.unique) {
                    const items = resource.selectList(state)
                    const match = items.find(i => i[property.name!] === value && item[idKey] !== i[idKey])
                    if(match)
                        return "Значение должно быть уникальным"
                }
                return undefined
            }
        }
    })

    const rules = mergeDeepRight(rulesObj, mergeRules) as any as Rules<RID, Fields>

    const getAllErrors = (item: Item) => (state: ISOState) => {
        const errors:Partial< {[K in keyof Fields]: string}> = {}
        Object.keys(rules).forEach((k: keyof Parts['Fields']) =>
            //@ts-ignore
            errors[k] = rules[k].getErrors({value: item[k],item,property: resource.properties[k], state, propertyName: k})
        )
        return errors
    }

    const getAllParams = (item: Item) => (state: ISOState) => {
        const params:Partial< {[K in keyof Fields]: GetParamsByMeta<Fields[K]>}> = {}
        Object.keys(rules).forEach((k: keyof Parts['Fields']) =>
            //@ts-ignore
            params[k] = rules[k].getParams({value: item[k],item,property: resource.properties[k], state, propertyName: k})
        )

        return params
    }

    const updateProperty = <K extends keyof Fields>(propName: K) =>
        ({value,item,state, mode}: {value: ItemWithId<RID, Fields>[K], item:  ItemWithId<RID, Fields>, state: ISOState, mode: 'edit'| 'create'})=>
            rules[propName].getUpdate({
                propertyName: propName,
                property: resource.fields[propName],
                item,state,value
            })

    return {
        resource,
        rules,
        getAllErrors,
        getAllParams,
        updateProperty
    }

}


class Clazz<RID extends string, Fields extends AnyFieldsMeta>{
    public create = (rid: RID, props: Fields)=> {
        return buildEditor<RID, Fields>({} as any, {} as any)
    }
}
export type RenEditor<RID extends string, Fields extends AnyFieldsMeta> = ReturnType<Clazz<RID, Fields>['create']>

