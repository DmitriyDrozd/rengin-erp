
export type RenSelectOption = {
    value: string
    label: string
    disabled?: boolean
}

export const optionsFromValuesList = (values: readonly string[]): RenSelectOption[] => {
    const options: RenSelectOption[] = []
    values.forEach(v => options.push({value:v, label: v}))
    return options
}

import {
    AnyAttr,
    AnyAttributes,
    EntitySlice,
    EnumAttr,
    isEnumAttr,
    isItemOfAttr,
    ItemByAttrs,
    ItemOfAttr,
} from "@shammasov/mydux"
import {mergeDeepRight} from "ramda";
import {USERS} from "./entities";
import {ENTITIES_MAP, ORMState} from "./orm";

export type GetParamsByMeta<M extends AnyAttr> = M extends EnumAttr
    ? ParamsEnumAttr
    : M extends ItemOfAttr
        ? ParamsItemOfAttr
        : ParamsDefaultMeta

export type ParamsItemOfAttr = {
    disabled?: boolean
    options: RenSelectOption[]
    addNewItemDefaults?: any
}
export type ParamsEnumAttr = {
    disabled?: boolean
    options: RenSelectOption[]
}
export type ParamsDefaultMeta = {
    disabled?: boolean

}


export type ResourceParts<Res = any> = Res extends {rid: infer EID, properties: infer Attrs}
    ?EID extends string
        ? Attrs extends AnyAttributes
            ? {
            Resource: Res
            Params: Partial<{[k in keyof Attrs]: GetParamsByMeta<Attrs[k]>}>
            Errors: Partial<{[k in keyof Attrs]: string}>
            Attrs: Attrs
            EID: EID
            Item: ItemByAttrs<Attrs,EID>
            ItemAttrs: ItemByAttrs<Attrs,EID>
        } & EntitySlice<Attrs, EID>
            : never
        :never
    :never

export type RuleArguments<EID extends string, Attrs extends AnyAttributes, K extends keyof EntitySlice<Attrs,EID>['attributes']> = {
    value: ItemByAttrs<Attrs,EID>[K]
    propertyName: K
    item: ItemByAttrs<Attrs,EID>,
    property: Attrs[K]
    state: ORMState
    role: typeof USERS.attributes.role.enum[number]
    currentUserId: string
}

type PropertyUpdater< Attrs extends AnyAttributes,
    K extends keyof Attrs,
    EID extends string = string > =
    (args: RuleArguments<EID, Attrs, K>) =>  ItemByAttrs<Attrs,EID>//<EID, F>

type PropertyGetParams <Attrs extends AnyAttributes,  K extends keyof EntitySlice<Attrs, EID>['attributes'],EID extends string = string> =
    (args: RuleArguments<EID,Attrs, K>) =>
        GetParamsByMeta<EntitySlice<Attrs, EID>['attributes'][K]>

type PropertyGetErrors < Attrs extends AnyAttributes,
    K extends keyof Attrs,
    EID extends string = string >=
    (args: RuleArguments<EID, Attrs, K>)   => string | undefined

export type PropRule< Attrs extends AnyAttributes, K extends keyof EntitySlice<Attrs, EID>['attributes'],EID extends string = string> = Partial<{
    getUpdate: PropertyUpdater<Attrs, K ,EID >
    getParams: PropertyGetParams<Attrs, K,EID>
    getErrors: PropertyGetErrors<Attrs, K,EID >
}>
export type Rules <EID extends string, Attrs extends AnyAttributes>= {
    [K in keyof Attrs]:PropRule<Attrs, K,EID >
}


export const buildEditor = <EID extends string,
    Attrs extends AnyAttributes
>(entity: EntitySlice<Attrs, EID>, mergeRules: Partial<Rules<EID, Attrs>>) => {
   type Res = EntitySlice<Attrs, EID>
    type Item =  ItemByAttrs<Attrs,EID>
    type Parts = ResourceParts<Res>

    const rulesObj: Record<string, PropRule<Attrs, keyof Attrs,EID>> = {} as any
    entity.attributesList.forEach( prop => {

        rulesObj[prop.name!] = {
            getParams: ({value, item, property, state}) => {
                const meta = property
                if(isItemOfAttr(meta)) {
                    const connectedRes = ENTITIES_MAP[meta.linkedEID]
                    return {
                        options: connectedRes.asOptions(
                            connectedRes.selectors.selectAll(state) as any[]
                        )
                    }
                }
                if(isEnumAttr(meta)) {
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
                    const items = entity.selectors.selectAll(state)
                    const match = items.find(i => i[property.name!] === value && item.id !== i.id)
                    if(match)
                        return "Значение должно быть уникальным"
                }
                return undefined
            }
        }
    })

    const rules = mergeDeepRight(rulesObj, mergeRules) as any as Rules<EID, Attrs>

    const getAllErrors = (item: Item) => (state: ORMState) => {
        const errors:Partial< {[K in keyof Attrs]: string}> = {}
        Object.keys(rules).forEach((k: keyof Parts['Attrs']) =>
            //@ts-ignore
            errors[k] = rules[k].getErrors({value: item[k],item,property: entity.attributes[k], state, propertyName: k})
        )
        return errors
    }

    const getAllParams = (item: Item) => (state: ORMState) => {
        const params:Partial< {[K in keyof Attrs]: GetParamsByMeta<Attrs[K]>}> = {}
        Object.keys(rules).forEach((k: keyof Parts['Attrs']) =>
            //@ts-ignore
            params[k] = rules[k].getParams({value: item[k],item,property: entity.attributes[k], state, propertyName: k})
        )

        return params
    }

    const updateProperty = <K extends keyof Attrs>(propName: K) =>
        ({value,item,state, mode}: {value: ItemByAttrs<Attrs,EID>[K], item:  ItemByAttrs<Attrs,EID>, state: ORMState, mode: 'edit'| 'create'})=>
            rules[propName].getUpdate({
                propertyName: propName,
                property: entity.attributes[propName],
                item,state,value
            })

    return {
        entity,
        rules,
        getAllErrors,
        getAllParams,
        updateProperty
    }

}


class Clazz<EID extends string, Attrs extends AnyAttributes>{
    public create = (rid: EID, props: Attrs)=> {
        return buildEditor<EID, Attrs>({} as any, {} as any)
    }
}
export type RenEditor<EID extends string, Attrs extends AnyAttributes> = ReturnType<Clazz<EID, Attrs>['create']>

