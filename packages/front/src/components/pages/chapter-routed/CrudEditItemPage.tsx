import {AnyFields, Resource} from 'iso/src/store/bootstrap/core/createResource'
import {useDispatch} from 'react-redux'
import React, {useRef, useState} from 'react'
import AppLayout from '../../app/AppLayout'
import {ProBreadcrumb, ProFormInstance} from '@ant-design/pro-components'
import type {CrudFormRender, CrudFormRenderProps} from './ItemChapter'
import getCrudPathname from '../../../hooks/getCrudPathname'
import {RForm} from '../../elements/RForm'
import {useHistory} from 'react-router'
import CrudCreateItemButton from '../../elements/CrudCreateButton'
import {AntdIcons} from '../../elements/AntdIcons'
import {Button} from 'antd'


export const CrudEditItemPage =  <
    RID extends string,
    Fields extends AnyFields,
    Res extends Resource<RID, Fields>
>({resource,renderForm,item,verb,form}: CrudFormRenderProps<RID, Fields,Res>& {renderForm: CrudFormRender<RID, Fields,Res>}) => {


    type Item = typeof resource.exampleItem
    const formRef = useRef<
        ProFormInstance<Item>
    >();

    const idProp = resource.idProp
    const id = ((item) as any as {[k in typeof idProp]: string})[idProp]
    const initialValues = item
    const dispatch = useDispatch()
    const history = useHistory()
    const [state, setState] = useState(initialValues)
    const onSubmit = async (values: Item) => {

        const patch = {...initialValues, ...values,[idProp]:id};
        const action = resource.actions.patched(patch, initialValues)
        console.log('Submit', values, action)
        if(action)
        dispatch(action)
        history.goBack()
        //            dispatch(BRANDS.actions.added(values))
    }
    const title = resource.getItemName(state)
    const onSave = () => {
        formRef.current?.submit()
    }
    const onDelete = () => {

    }
    const onBack = () =>
        history.goBack()
    return  <AppLayout
                 header={{onBack ,
                     extra:[
                         <Button danger ghost icon={<AntdIcons.DeleteOutlined/>} onClick={onDelete}>Удплить</Button>,
                         <Button type={'primary'} icon={<AntdIcons.SaveOutlined/>} onClick={onSave}>Сохранить</Button>]
                    }}
                 proLayout={{
                    //title,
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
                    onSubmit(values)
                }}
                onReset={onBack}
            >
                {
                    renderForm({resource, item: state,id,verb,form})
                }
            </RForm>

    </AppLayout>
}

