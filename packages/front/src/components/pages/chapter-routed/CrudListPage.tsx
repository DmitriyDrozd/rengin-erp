import {AnyAttributes, EntitySlice} from '@shammasov/mydux'
import {useDispatch} from 'react-redux'
import React, {useState} from 'react'
import AppLayout from '../../app/AppLayout'
import {CrudListRender, CrudListRenderProps} from './ItemChapter'

export const CrudListPage = <
    EID extends string,
    Attrs extends AnyAttributes,
    Res extends EntitySlice<Attrs, EID>
>({resource,renderList,verb,form}: CrudListRenderProps<EID, Attrs>& {renderList: CrudListRender<EID, Attrs>}) => {
    type Item = typeof resource.exampleItem

    const item: Item = {} as any
    const initialValues = item
    const dispatch = useDispatch()
    const [state, setState] = useState(item)
    const onSubmit = async (values: Item) => {

        dispatch(resource.actions.patched(values, initialValues))
        //            dispatch(BRANDS.actions.added(values))
    }

    return  <AppLayout
                hidePageContainer={true}
                proLayout={{contentStyle:{
                    padding: '0px'
                }
                }}
            >

        {
            renderList({resource, verb:'LIST',form})
        }

    </AppLayout>
}
