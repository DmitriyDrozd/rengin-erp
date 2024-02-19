import {useDispatch} from 'react-redux'
import React, {useRef, useState} from 'react'
import AppLayout from '../../../app/layout/AppLayout'
import {ProFormInstance} from '@ant-design/pro-components'
import {ItemChapterProps} from './ItemChapter'
import getCrudPathname from '../../../hooks/getCrudPathname'
import {RForm} from '../../elements/RForm'
import {useNavigate} from 'react-router-dom'
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
    const {entity,renderForm,item,renderItemInfo,verb,renderList,id} = props
entity.actions.updated
    type Item = typeof entity.exampleItem
    const formRef = useRef<
        ProFormInstance<Item>
    >();

    const initialValues = item
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [state, setState] = useState(initialValues)
    const onSubmit = async (values: Item) => {

        const patch = {...initialValues, ...values,id};
        const action = entity.actions.patched(patch, initialValues)
        console.log('Submit', values, action)
        navigate(-1)
        if(action)
         dispatch(action)

        //            dispatch(BRANDS.actions.added(values))
    }
    const title = entity.getItemName(state)
    const onSave = () => {
        formRef.current?.submit()
    }
    const onDelete = () => {
        dispatch(entity.actions.removed(id))
        onBack()
    }
    const layoutProps = {
        labelCol: { span: 6 },
        wrapperCol: { span:18 },
    }
    const onBack = () =>
        navigate(-1)
    return  <AppLayout




                proLayout={{
                     extra:[
                         <CancelButton onCancel={onBack}/>,
                         <DeleteButton  entity={entity} id={id} onDeleted={onDelete}/>,
                         <Button type={'primary'} icon={<AntdIcons.SaveOutlined/>} onClick={onSave}>Сохранить</Button>
                     ],
                     title:'Rengin'
                    }}
                onBack={onBack}

                title={<Breadcrumb items={ [   {
                        href: getCrudPathname(entity).view(),

                        title: entity.langRU.plural
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
                    renderForm({entity, item: state,id,verb,renderItemInfo})
                }
            </RForm>
        {
            renderItemInfo  && renderItemInfo({...props, item})
        }
    </AppLayout>
}

