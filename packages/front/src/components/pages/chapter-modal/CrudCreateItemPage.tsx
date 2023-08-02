import {AnyFields, Resource} from 'iso/src/store/bootstrap/core/createResource'
import {generateGuid} from '@sha/random'
import React, {useRef, useState} from 'react'
import {useDispatch} from 'react-redux'
import AppLayout from '../../app/AppLayout'
import {ProBreadcrumb} from '@ant-design/pro-components'
import type {CrudFormRender, CrudFormRenderProps} from './ItemChapterModal'
import {RForm} from '../../elements/RForm'
import getCrudPathname from '../../../hooks/getCrudPathname'
import {useHistory} from 'react-router'


export const CrudCreateItemPage =  <
    RID extends string,
    Fields extends AnyFields,
    Res extends Resource<RID, Fields>
>({resource,renderForm, form,verb}:
      CrudFormRenderProps<RID, Fields,Res>& {renderForm: CrudFormRender<RID, Fields,Res>}) => {
    type Item = Partial<typeof resource.exampleItem>
    const idProp = resource.idProp
    const id = generateGuid()//item[idProp]
    const initialValues:Item = {[idProp]: id }as any as Item
    const [state, setState] = useState(initialValues) as any as [Item, (otem: Item)=>any]
    const dispatch = useDispatch()

    const formRef = useRef()
    const onSubmit = async (values: Item) => {
        const patch = {[idProp]:id, ...values}
        const action = resource.actions.added(patch)
        console.log('Submit', values, action)
        dispatch(action)

        //            dispatch(BRANDS.actions.added(values))
    }

    console.log('Initial alues', initialValues)
    const history = useHistory()
    const onBack = () =>
        history.goBack()


    const title =  "Новый "+resource.langRU.singular
    return  <AppLayout

                header={{onBack }}
                proLayout={{
                    title,
                    headerContentRender: () => <ProBreadcrumb />,
                    breadcrumbRender:(routers = []) =>( [
                        {
                            path: getCrudPathname(resource).view(),
                            title: resource.langRU.plural
                        },
                        {
                            title,
                        }
                    ])
                }}


            >
        <RForm<Item>
            formRef={formRef}

            readonly={false}
            initialValues={initialValues}
            onValuesChange={(_, values) => {
                console.log(values);
                setState(values)
            }}
            onFinish={async (values) => {
                console.log('onFinish',values)
                onSubmit(values);
                history.goBack()
            }
            }
            submitter={{
                render: (props) => null
            }}
        >
            {
                renderForm({resource, form,item:state,id, verb: 'CREATE'})
            }
        </RForm>

    </AppLayout>
}
