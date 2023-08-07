import {AnyFieldsMeta, ItemWithId, Resource} from 'iso/src/store/bootstrap/core/createResource'
import React from 'react'
import usePathnameResource from '../../../hooks/usePathnameResource'
import {FormInstance} from '@ant-design/pro-components'
import {CrudEditItemPage, CrudFormRenderProps} from './CrudEditItemPage'
import {CrudCreateItemPage} from './CrudCreateItemPage'
import {CrudListPage} from './CrudListPage'
import BRANDS from 'iso/src/store/bootstrap/repos/brands'
import {isItemOfMeta, valueTypes} from 'iso/src/store/bootstrap/core/valueTypes'
import {getRes, ResourceName, RESOURCES_MAP} from 'iso/src/store/bootstrap/resourcesList'
import useFrontSelector, {useFrontStateSelector} from '../../../hooks/common/useFrontSelector'


export const fieldMetaToProProps =<
    RID extends string,
    Fields extends AnyFieldsMeta,
    K extends keyof Resource<RID, Fields>['exampleItem']
>  (resource: Resource<RID, Fields>, key: K, item?: Partial<ItemWithId<RID,Fields>>) =>{
    const meta = resource.properties[key]
    const state = useFrontStateSelector()
    const getLinkedResourceOptions = () => {
        if (isItemOfMeta(meta)) {
            const linkedResource: Resource<any, any> = getRes(meta.linkedResourceName)
            const list = linkedResource.selectList(state)
            return linkedResource.asValueEnum(list)
        }
        return undefined
    }
    const proProp = ({
        name: key,
        label: meta.headerName,
        required: resource.properties[key].required,
        placeholder: resource.properties[key].headerName,
        valueEnum: getLinkedResourceOptions()
    })

    console.log(resource.factoryPrefix, key ,proProp)
    return proProp
}


type CrudBaseRenderProps <
    RID extends string,
    Fields extends AnyFieldsMeta,
>  =  {
    resource: Resource<RID, Fields>
    form?: FormInstance<Resource<RID, Fields>['exampleItem']>
}

export type CrudListRenderProps<
    RID extends string,
    Fields extends AnyFieldsMeta,
>  = CrudBaseRenderProps<RID,Fields> & {verb: 'LIST', }




export type ItemChapterProps<
    RID extends string,
    Fields extends AnyFieldsMeta,
> = {
    resource: Resource<RID, Fields>
    onImport?: Function
    renderForm: (props: CrudFormRenderProps<RID, Fields> ) => React.ReactNode
    renderItemInfo?: (props: CrudFormRenderProps<RID, Fields>) => React.ReactNode
    renderList: (props: CrudListRenderProps<RID , Fields>) => React.ReactNode
}

export type CrudFormRender<
    RID extends string,
    Fields extends AnyFieldsMeta,
>  = (props: CrudFormRenderProps<RID, Fields>) => React.ReactNode
export type CrudListRender<
    RID extends string,
    Fields extends AnyFieldsMeta,
>  = (props: CrudListRenderProps<RID, Fields>) => React.ReactNode
export default <
        RID extends string,
        Fields extends AnyFieldsMeta,
        Res extends Resource<RID, Fields>
    >
    ({
         resource,renderItemInfo,
         renderForm, renderList}: ItemChapterProps<RID, Fields> ) => {
    const pathRes = usePathnameResource()
    if(pathRes.resource.collection === resource.collection) {
       // if (pathRes.verb === 'VIEW')
        //    return <EditItemPage {...pathRes} renderForm={renderForm}  />
        if (pathRes.verb === 'EDIT')
            return <CrudEditItemPage {...pathRes} renderForm={renderForm} renderItemInfo={renderItemInfo} />
        if (pathRes.verb === 'CREATE')
            return <CrudCreateItemPage {...pathRes} renderForm={renderForm} />
        if (pathRes.verb === 'LIST')
            return <CrudListPage renderList={renderList} {...pathRes}/>

    }
    return <div>Expected  {resource.collection} Resource, found {pathRes.resource.collection}</div>

}
