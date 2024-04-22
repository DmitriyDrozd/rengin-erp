import {
    AnyFieldsMeta,
    Resource
} from 'iso/src/store/bootstrap/core/createResource';
import { useDispatch } from 'react-redux';
import React, { useState } from 'react';
import AppLayout from '../../app/AppLayout';
import {
    CrudListRender,
    CrudListRenderProps
} from './ItemChapter';

export const CrudListPage = <
    RID extends string,
    Fields extends AnyFieldsMeta,
    Res extends Resource<RID, Fields>
>({resource, renderList, verb, form}: CrudListRenderProps<RID, Fields, Res> & { renderList: CrudListRender<RID, Fields, Res> }) => {
    // type Item = typeof resource.exampleItem
    // const idProp = resource.idProp
    // const item: Item = {} as any
    // const id = ((item) as any as {[k in typeof idProp]: string})[idProp]
    // const initialValues = item
    // const dispatch = useDispatch()
    // const [state, setState] = useState(item)
    // const onSubmit = async (values: Item) => {
    //
    //     dispatch(resource.actions.patched(values, initialValues))
    //     //            dispatch(BRANDS.actions.added(values))
    // }

    return (
        <AppLayout
            hidePageContainer={true}
            proLayout={{
                contentStyle: {
                    padding: '0px'
                }
            }}
        >
            {
                renderList({resource, verb: 'LIST', form})
            }
        </AppLayout>
    );
};
