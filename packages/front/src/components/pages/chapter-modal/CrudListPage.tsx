import {AnyFieldsMeta, Resource} from 'iso/src/store/bootstrap/core/createResource'
import {useDispatch} from 'react-redux'
import React, {useState} from 'react'
import AppLayout from '../../app/AppLayout'
import {CrudListRender, CrudListRenderProps} from './ItemChapterModal'
import CrudCreateItemButton from '../../elements/CreateButton'
import {RForm} from '../../elements/RForm'
import {ProCard} from '@ant-design/pro-components'

export const CrudListPage = <
    RID extends string,
    Fields extends AnyFieldsMeta,
    Res extends Resource<RID, Fields>
>({resource,renderList,verb,form,onCreate}: CrudListRenderProps<RID, Fields,Res>& {renderList: CrudListRender<RID, Fields,Res>, onCreate: Function}) => {
    type Item = typeof resource.exampleItem
    const idProp = resource.idProp
    const item: Item = {} as any
    const id = ((item) as any as {[k in typeof idProp]: string})[idProp]
    const initialValues = item
    const dispatch = useDispatch()
    const [state, setState] = useState(item)
    const onSubmit = async (values: Item) => {

        dispatch(resource.actions.patched(values, initialValues))
        //            dispatch(BRANDS.actions.added(values))
    }

    return  <AppLayout
                header={{
                   // title: resource.langRU.plural,
                    extra:[<CrudCreateItemButton/>]
                }}
            >
        <RForm
            submitter={{
                render: (props, dom) => null
            }}
            readonly={false}
            initialValues={initialValues}
            onValuesChange={(_, values) => {
                console.log(values);
                setState(values)
            }}
            onFinish={async (values) => {
                console.log('onFinish',values)
                onSubmit(values)
            }
            }
        >

        {
            renderList({resource, verb:'LIST',form})
        }

        </RForm>
    </AppLayout>
}
