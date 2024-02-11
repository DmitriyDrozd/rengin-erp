import {generateGuid} from '@shammasov/utils'
import React, {useRef, useState} from 'react'
import {useDispatch} from 'react-redux'
import AppLayout from '../../app/AppLayout'
import {ProFormInstance} from '@ant-design/pro-components'
import type {CrudFormRender} from './ItemChapter'
import {RForm} from '../../elements/RForm'
import getCrudPathname from '../../../hooks/getCrudPathname'
import {useHistory} from 'react-router'
import {Breadcrumb, Button} from 'antd'
import {AntdIcons} from '../../elements/AntdIcons'
import {useQueryObject} from '../../../hooks/useQueryObject'
import CancelButton from '../../elements/CancelButton'
import {AnyAttributes, EntitySlice} from "@shammasov/mydux";
import {CrudFormRenderProps} from "./CrudEditItemPage";

const layoutProps = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
}
export const CrudCreateItemPage =  <
    EID extends string,
    Attrs extends AnyAttributes,
    Res extends EntitySlice<Attrs, EID>
>({resource,renderForm, form,verb}:
      CrudFormRenderProps<EID, Attrs>& {renderForm: CrudFormRender<EID, Attrs>}) => {
    type Item = typeof resource.exampleItem
    const formRef = useRef<
        ProFormInstance<Item>
    >();

    const id = generateGuid()//item[idProp]
    const predefinedValues = useQueryObject<Item>()
    const initialValues:Item = {id: id, ...predefinedValues }as any as Item
    const [state, setState] = useState(initialValues) as any as [Item, (otem: Item)=>any]
    const dispatch = useDispatch()

    const onSubmit = async (values: Item) => {
        const patch = {id:id, ...values}
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
