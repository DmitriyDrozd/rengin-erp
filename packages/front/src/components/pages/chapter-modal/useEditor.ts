import {createContext, useContext, useState} from "react";
import {AnyFieldsMeta, ItemWithId, Resource} from "iso/src/store/bootstrap/core/createResource";
import {useDispatch, useSelector} from "react-redux";
import {isEmpty} from "ramda";
import {useISOState} from "iso/src/ISOState";
import {GetParamsByMeta, RenEditor} from "iso/src/store/bootstrap/buildEditor";
import {generateGuid} from "@sha/random";
import {useHistory} from "react-router";
import useLedger from '../../../hooks/useLedger';
import { generateNewListItemNumber } from '../../../utils/byQueryGetters';

const getArrayPropsForNewItem = <Fields extends AnyFieldsMeta>(fields: Fields) => {
    const obj : any = []
    Object.values(fields).filter(f => f.type === 'array').forEach(f => obj[f.name] = [])
    return obj
}
export const useEditor =  <
    RID extends string,
    Fields extends AnyFieldsMeta,
> ( editor: RenEditor<RID, Fields>,
    idOrInitItem: 'create' | string | ItemWithId<RID,Fields>
   ) => {


    const history = useHistory()
    history.location.state
    const dispatch = useDispatch()
    type Item = ItemWithId<RID, Fields>
    const res = editor.resource
    const [newItem] = useState({[res.idProp]: generateGuid(), ...getArrayPropsForNewItem(res.properties)})
    const state = useISOState()
    const items: Item[] = useSelector(editor.resource.selectList) as any
    const mode = idOrInitItem === 'create' ? 'create' : 'edit'
    const id = idOrInitItem === 'create'
        ? newItem[res.idProp]
        : typeof idOrInitItem === 'string'
            ? idOrInitItem
            : idOrInitItem[res.idProp]
    const initItem: Item = idOrInitItem === 'create'
        ? newItem
        : typeof idOrInitItem === 'string'
            ? items.find(i => i[res.idProp] === id)!
            : idOrInitItem

    const [item, setItem] = useState(initItem)
    const ledger = useLedger();
    const list = ledger[editor.resource.collection].list;

    const updateItemProperty = <K extends keyof Fields>(prop: K) =>
        (value: ItemWithId<RID,Fields>[K]) => {
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
            let savingItem = item;
            const clientsNumberProp = editor.resource.clientsNumberProp;

            if (clientsNumberProp && !item[clientsNumberProp]) {
                const clientsNumber = clientsNumberProp ? generateNewListItemNumber(list, clientsNumberProp) : undefined

                savingItem = {
                    ...item,
                    [clientsNumberProp]: clientsNumber
                };
            }

            if (mode === 'create') {
                dispatch(editor.resource.actions?.added(savingItem))
            } else if (JSON.stringify(initItem) !== JSON.stringify(savingItem)) {
                dispatch(editor.resource.actions?.patched(savingItem))
            }
        },
        updateItemProperty,
        validateProps: () => {

        },
        getRenFieldProps:<K extends keyof Fields>(prop: K) => {
            return {mode: mode as 'create' |'edit',
                editor,
                rules: editor.rules[prop],
                value: item[prop],
                property: editor.resource.properties[prop],
                updateItemProperty: updateItemProperty(prop),
                error: errors[prop] as any as string | undefined,
                params: params[prop] as any as GetParamsByMeta<typeof res.properties[K]>
            }
        }
    }

    return result

}



export const useContextEditor = <RID extends string, Fields extends AnyFieldsMeta>(res?: Resource<RID, Fields>) => {
    const editor = useContext(EditorContext)
    return editor as any as UseEditorReturn<RID,Fields>
}

export const useContextEditorProperty =  <RID extends string, Fields extends AnyFieldsMeta, K extends keyof ItemWithId<RID,Fields>>
(resource: Resource<RID, Fields> | string, property?: K) => {
    const editor = useContextEditor<RID,Fields>()
    return editor.getRenFieldProps(property || resource)
}



export const EditorContext = createContext<UseEditorReturn<any, any>>({} as any)


class Clazz<RID extends string, Fields extends AnyFieldsMeta>{
    public create = (rid: RID, props: Fields)=> {
        return useEditor<RID, Fields>({} as any, {} as any)
    }
}
export type UseEditorReturn<RID extends string, Fields extends AnyFieldsMeta> = ReturnType<Clazz<RID, Fields>['create']>




