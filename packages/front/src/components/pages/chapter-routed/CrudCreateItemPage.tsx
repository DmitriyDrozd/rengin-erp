import {AnyFieldsMeta, Resource} from 'iso/src/store/bootstrap/core/createResource'
import {generateGuid} from '@sha/random'
import React, {useRef, useState} from 'react'
import {useDispatch} from 'react-redux'
import AppLayout from '../../app/AppLayout'
import {ProFormInstance} from '@ant-design/pro-components'
import type {CrudFormRender, CrudFormRenderProps} from './ItemChapter'
import {RForm} from '../../elements/RForm'
import getCrudPathname from '../../../hooks/getCrudPathname'
import {useHistory} from 'react-router'
import {Breadcrumb, Button} from 'antd'
import {AntdIcons} from '../../elements/AntdIcons'
import {useQueryObject} from '../../../hooks/useQueryObject'
import CancelButton from '../../elements/CancelButton'

const layoutProps = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
}
export const CrudCreateItemPage =  <
    RID extends string,
    Fields extends AnyFieldsMeta,
    Res extends Resource<RID, Fields>
>({resource,renderForm, form,verb}:
      CrudFormRenderProps<RID, Fields,Res>& {renderForm: CrudFormRender<RID, Fields,Res>}) => {
    type Item = typeof resource.exampleItem
    const formRef = useRef<
        ProFormInstance<Item>
    >();
    const idProp = resource.idProp
    const id = generateGuid()//item[idProp]
    const predefinedValues = useQueryObject<Item>()
    const initialValues:Item = {[idProp]: id, ...predefinedValues }as any as Item
    const [state, setState] = useState(initialValues) as any as [Item, (otem: Item)=>any]
    const dispatch = useDispatch()

    const onSubmit = async (values: Item) => {
        const patch = {[idProp]:id, ...values}
        const action = resource.actions.added(patch)
        console.log('Submit', values, action)
        dispatch(action)

        //            dispatch(BRANDS.actions.added(values))
    }

    console.log('Initial alues', initialValues)
    const history = useHistory()


    const onSave = () => {
        formRef.current?.submit()
    }
    const onDelete = () => {
    onBack()
    }
    const onBack = () =>
        history.goBack()

    const backButton = <Button type="primary" shape="circle" icon={<AntdIcons.ArrowLeftOutlined />}  />
    const title =
        <span>{"Новый "+resource.langRU.singular}</span>
    return  <AppLayout


                proLayout={{

                    extra:[
                        <CancelButton onCancel={onBack}/>,
                        <Button type={'primary'} icon={<AntdIcons.SaveOutlined/>} onClick={onSave}>Создать</Button>
                    ],
                title:'Rengin',

                }}
                onBack={onBack}

                title={<Breadcrumb items={ [   {
                    href: getCrudPathname(resource).view(),

                    title: resource.langRU.plural
                },
                {
                    title,
                }]} ></Breadcrumb>
    }

            >
        <RForm<Item>
            formRef={formRef}
            layout={'horizontal'}
            {...layoutProps}
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
