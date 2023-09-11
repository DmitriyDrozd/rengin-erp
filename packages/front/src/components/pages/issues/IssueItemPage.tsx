import {AnyFieldsMeta, ExtractResource, Resource} from 'iso/src/store/bootstrap/core/createResource'
import {useDispatch, useSelector} from 'react-redux'
import React, {useCallback, useRef, useState} from 'react'
import AppLayout from '../../app/AppLayout'
import {FormInstance, ProBreadcrumb, ProCard, ProFormInstance} from '@ant-design/pro-components'
import type {CrudFormRender} from './ItemChapter'
import getCrudPathname from '../../../hooks/getCrudPathname'
import {RForm} from '../../elements/RForm'
import {useHistory} from 'react-router'
import CrudCreateItemButton from '../../elements/CreateButton'
import {AntdIcons} from '../../elements/AntdIcons'
import {Breadcrumb, Button} from 'antd'
import DeleteButton from '../../elements/DeleteButton'
import CancelButton from '../../elements/CancelButton'
import usePathnameResource from '../../../hooks/usePathnameResource'
import VDevidedCard from '../../elements/VDevidedCard'
import EditIssueItemForm from './EditIssueItemForm'
import {ISSUES, IssueVO} from 'iso/src/store/bootstrap/repos/issues'




export default () => {
    const {resource,id,item,verb} = usePathnameResource()
    type Item = typeof resource.exampleItem
    const formRef = useRef<
        ProFormInstance<Item>
    >();

    const initialValues:IssueVO =useSelector(ISSUES.selectById(id))
    const [state, setState] = useState(initialValues) as any as [Item, (otem: Item)=>any]

    const idProp = resource.idProp
    const dispatch = useDispatch()
    const history = useHistory()

    const onSubmit = async (values: Item) => {

        const patch = {...initialValues, ...values,[idProp]:id};
        const action = resource.actions.patched(patch, initialValues)
        console.log('Submit', values, action)
        history.goBack()
        if(action)
            dispatch(action)

        //            dispatch(BRANDS.actions.added(values))
    }
    const onItemChange = useCallback((state) => {
        setState(state)
    },[id])
    const title = resource.getItemName(state)
    const onSave = () => {
        dispatch(resource.actions?.patched(state))
        onBack()
    }
    const onDelete = () => {
        dispatch(resource.actions.removed(id))
        onBack()
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

        <VDevidedCard>
            <ProCard title="Заявка" colSpan="50%">
                <EditIssueItemForm issueId={id} onItemChange={onItemChange}/>
            </ProCard>
            <ProCard title="История">
                <div style={{ height: 360 }}>История</div>
            </ProCard>
        </VDevidedCard>


    </AppLayout>
}

