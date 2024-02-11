import {createContext, useContext, useState} from "react";
import {AnyAttributes, EmpheralAttributes, EntitySlice, ItemByAttrs} from '@shammasov/mydux';
import {useDispatch, useSelector} from "react-redux";
import {isEmpty} from "ramda";
import {GetParamsByMeta, RenEditor, useORMState} from "iso";
import {generateGuid} from "@shammasov/utils";
import {useHistory} from "react-router";

const getArrayPropsForNewItem = <Attrs extends EmpheralAttributes>(fields: Attrs) => {
    const obj : any = []
    Object.values(fields).filter(f => f.type === 'array').forEach(f => obj[f.name] = [])
    return obj
}
export const useEditor =  <
    EID extends string,
    Attrs extends AnyAttributes,
> ( editor: RenEditor<EID, Attrs>,
    idOrInitItem: 'create' | string | ItemByAttrs<Attrs>
   ) => {


    const history = useHistory()
    history.location.state
    const dispatch = useDispatch()
    type Item = ItemByAttrs<Attrs>
    const res = editor.resource
    const [newItem] = useState({id: generateGuid(), ...getArrayPropsForNewItem(res.attributes)})
    const state = useORMState()
    const items: Item[] = useSelector(editor.resource.selectors.selectAll) as any
    const mode = idOrInitItem === 'create' ? 'create' : 'edit'
    const id = idOrInitItem === 'create'
        ? newItem.id
        : typeof idOrInitItem === 'string'
            ? idOrInitItem
            : idOrInitItem.id
    const initItem: Item = idOrInitItem === 'create'
        ? newItem
        : typeof idOrInitItem === 'string'
            ? items.find(i => i.id === id)!
            : idOrInitItem

    const [item, setItem] = useState(initItem)



    const updateItemProperty = <K extends keyof Attrs>(prop: K) =>
        (value: ItemByAttrs<Attrs>[K]) => {
            setItem(editor.updateProperty(prop)({item,value,state, mode}))
        }
    const errors = editor.getAllErrors(item)(state)
    const params = editor.getAllParams(item)(state)
    const result = {
        editor,
        rules: editor.rules,
        resource: editor.resource,
        hasChanges: JSON.stringify(initItem) !== JSON.stringify(item),
        isValid: isEmpty(errors),
        item,
        params,
        errors,
        mode: mode as 'create' |'edit',
        remove: () => {
            dispatch(editor.resource.actions.removed(id))
        },
        save: () => {
            if(mode === 'create')
                dispatch(editor.resource.actions?.added(item))
           else  if(JSON.stringify(initItem) !== JSON.stringify(item))
            dispatch(editor.resource.actions?.patched(item))
        },
        updateItemProperty,
        validateProps: () => {

        },
        getRenFieldProps:<K extends keyof Attrs>(prop: K) => {
            return {mode: mode as 'create' |'edit',
                editor,
                rules: editor.rules[prop],
                value: item[prop],
                property: editor.resource.attributes[prop],
                updateItemProperty: updateItemProperty(prop),
                error: errors[prop] as any as string | undefined,
                params: params[prop] as any as GetParamsByMeta<typeof res.attributes[K]>
            }
        }
    }

    return result

}



export const useContextEditor = <EID extends string, Attrs extends AnyAttributes>(res?: EntitySlice<Attrs, EID>) => {
    const editor = useContext(EditorContext)
    return editor as any as UseEditorReturn<EID,Attrs>
}

export const useContextEditorProperty =  <EID extends string, Attrs extends AnyAttributes, K extends keyof ItemByAttrs<Attrs>>
(resource: EntitySlice<Attrs, EID> | string, property?: K) => {
    const editor = useContextEditor<EID,Attrs>()
    return editor.getRenFieldProps(property || resource)
}



export const EditorContext = createContext<UseEditorReturn<any, any>>({} as any)


class Clazz<EID extends string, Attrs extends AnyAttributes>{
    public create = (rid: EID, props: Attrs)=> {
        return useEditor<EID, Attrs>({} as any, {} as any)
    }
}
export type UseEditorReturn<EID extends string, Attrs extends AnyAttributes> = ReturnType<Clazz<EID, Attrs>['create']>




