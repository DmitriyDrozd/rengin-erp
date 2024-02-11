import {useDispatch} from 'react-redux'
import React, {useRef, useState} from 'react'
import AppLayout from '../../app/AppLayout'
import {ProFormInstance} from '@ant-design/pro-components'
import {ItemChapterProps} from './ItemChapter'
import getCrudPathname from '../../../hooks/getCrudPathname'
import {RForm} from '../../elements/RForm'
import {useHistory} from 'react-router'
import {AntdIcons} from '../../elements/AntdIcons'
import {Breadcrumb, Button} from 'antd'
import DeleteButton from '../../elements/DeleteButton'
import CancelButton from '../../elements/CancelButton'
import {AnyAttributes, EntitySlice} from "@shammasov/mydux";


export type CrudFormRenderProps<
    EID extends string,
    Attrs extends AnyAttributes,
>  =  ItemChapterProps<EID,Attrs> & {
    item: Partial<EntitySlice<Attrs, EID>['exampleItem']>
    id: string
    verb: 'EDIT' | 'CREATE' |'VIEW'
}


export const CrudEditItemPage =  <
    EID extends string,
    Attrs extends AnyAttributes,
>(props: CrudFormRenderProps<EID, Attrs>) => {
    const {resource,renderForm,item,renderItemInfo,verb,renderList,id} = props
resource.actions.updated
    type Item = typeof resource.exampleItem
    const formRef = useRef<
        ProFormInstance<Item>
    >();

    const initialValues = item
    const dispatch = useDispatch()
    const history = useHistory()
    const [state, setState] = useState(initialValues)
    const onSubmit = async (values: Item) => {

        const patch = {...initialValues, ...values,id};
        const action = resource.actions.patched(patch, initialValues)
        console.log('Submit', values, action)
        history.goBack()
        if(action)
         dispatch(action)

        //            dispatch(BRANDS.actions.added(values))
    }
    const title = resource.getItemName(state)
    const onSave = () => {
        formRef.current?.submit()
    }
    const onDelete = () => {
        dispatch(resource.actions.removed(id))
        onBack()
    }
    const layoutProps = {
        labelCol: { span: 6 },
        wrapperCol: { span:18 },
    }
    const onBack = () =>
        history.goBack()
    return  <AppLayout




                proLayout={{
                     extra:[
                         <CancelButton onCancel={onBack}/>,
                         <DeleteButton  resource={resource} id={id} onDeleted={onDelete}/>,
                         <Button type={'primary'} icon={<AntdIcons.SaveOutlined/>} onClick={onSave}>Сохранить</Button>
                     ],
                     title:'Rengin'
                    }}
                onBack={onBack}

                title={<Breadcrumb items={ [   {
                        href: getCrudPathname(resource).view(),

                        title: resource.langRU.plural
                    },
                        {
                            title,
                        }]} ></Breadcrumb>
                }>

            <RForm<Item>
            layout={'horizontal'}
            {
                ...layoutProps
            }
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
                submitter={{
                    render: (props) => null
                }}
            >
                {
                    renderForm({resource, item: state,id,verb,renderItemInfo})
                }
            </RForm>
        {
            renderItemInfo  && renderItemInfo({...props, item})
        }
    </AppLayout>
}

