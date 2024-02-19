import {AnyAttributes, EntitySlice} from '@shammasov/mydux'
import {useDispatch} from 'react-redux'
import React, {useState} from 'react'
import AppLayout from '../../../app/layout/AppLayout'
import {CrudListRender, CrudListRenderProps} from './ItemChapter'

export const CrudListPage = <
    EID extends string,
    Attrs extends AnyAttributes,
    Res extends EntitySlice<Attrs, EID>
>({entity,renderList,verb,form}: CrudListRenderProps<EID, Attrs>& {renderList: CrudListRender<EID, Attrs>}) => {
    type Item = typeof entity.exampleItem

    const item: Item = {} as any
    const initialValues = item
    const dispatch = useDispatch()
    const [state, setState] = useState(item)
    const onSubmit = async (values: Item) => {

        dispatch(entity.actions.patched(values, initialValues))
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
            renderList({entity, verb:'LIST',form})
        }

    </AppLayout>
}
