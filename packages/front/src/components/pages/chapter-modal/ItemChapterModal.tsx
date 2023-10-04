import {AnyFieldsMeta, Resource} from 'iso/src/store/bootstrap/core/createResource'
import React from 'react'
import usePathnameResource from '../../../hooks/usePathnameResource'
import {FormInstance} from '@ant-design/pro-components'
import {CrudEditItemPage} from './CrudEditItemPage'
import {CrudCreateItemPage} from './CrudCreateItemPage'
import {CrudListPage} from './CrudListPage'
import {RESOURCES_MAP} from 'iso/src/store/bootstrap/resourcesList'


export const proProp =<
    RID extends string,
    Fields extends AnyFieldsMeta,
    K extends keyof Resource<RID, Fields>['exampleItem']
>  (resource: Resource<RID, Fields>, key: K) =>{
    const prop =resource.properties[key]
    return ({
        name: key,
        label: prop.headerName,
        required: resource.properties[key].required,
        placeholder: resource.properties[key].headerName,
        valueEnum: prop.res ? RESOURCES_MAP[prop.res].asValueEnum() : undefined
    })
}


type CrudBaseRenderProps <
    RID extends string,
    Fields extends AnyFieldsMeta,
    Res extends Resource<RID, Fields>
>  =  {
    resource: Res
    form?: FormInstance<Res['exampleItem']>
}

export type CrudListRenderProps<
    RID extends string,
    Fields extends AnyFieldsMeta,
    Res extends Resource<RID, Fields>
>  = CrudBaseRenderProps<RID,Fields,Res> & {verb: 'LIST'}

export type CrudFormRenderProps<
    RID extends string,
    Fields extends AnyFieldsMeta,
    Res extends Resource<RID, Fields>
>  =  {
    resource: Resource<RID, Fields>
    item: Partial<Resource<RID, Fields>['exampleItem']>
    id: string
    verb: 'EDIT' | 'CREATE' |'VIEW'
    form?: FormInstance<Resource<RID, Fields>['exampleItem']>
}



export type ItemChapterProps<
    RID extends string,
    Fields extends AnyFieldsMeta,
    Res extends Resource<RID, Fields>
> = {
    resource: Res
    renderForm: (props: CrudFormRenderProps<RID, Fields,Res> ) => React.ReactNode
    renderList: (props: CrudListRenderProps<RID , Fields,Res>) => React.ReactNode
}

export type CrudFormRender<
    RID extends string,
    Fields extends AnyFieldsMeta,
    Res extends Resource<RID, Fields>
>  = (props: CrudFormRenderProps<RID, Fields, Res>) => React.ReactNode
export type CrudListRender<
    RID extends string,
    Fields extends AnyFieldsMeta,
    Res extends Resource<RID, Fields>
>  = (props: CrudListRenderProps<RID, Fields, Res>) => React.ReactNode
export default <
        RID extends string,
        Fields extends AnyFieldsMeta,
        Res extends Resource<RID, Fields>
    >
    ({resource, renderForm, renderList}: ItemChapterProps<RID, Fields, Res> ) => {
    const pathRes = usePathnameResource()
    if(pathRes.resource.collection === resource.collection) {
       // if (pathRes.verb === 'VIEW')
        //    return <EditItemPage {...pathRes} renderForm={renderForm}  />
        if (pathRes.verb === 'EDIT')
            return <CrudEditItemPage {...pathRes} renderForm={renderForm}  />
        if (pathRes.verb === 'CREATE')
            return <CrudCreateItemPage {...pathRes} renderForm={renderForm} />
        if (pathRes.verb === 'LIST')
            return <CrudListPage renderList={renderList} {...pathRes}/>

    }
    return <div>Expected  {resource.collection} Resource, found {pathRes.resource.collection}</div>

}
