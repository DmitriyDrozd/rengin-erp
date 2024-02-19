import {AnyAttributes, EntitySlice, ItemByAttrs} from '@shammasov/mydux/'
import React from 'react'
import usePathnameResource from '../../../hooks/usePathnameResource'
import {FormInstance} from '@ant-design/pro-components'
import {CrudEditItemPage, CrudFormRenderProps} from './CrudEditItemPage'
import {CrudCreateItemPage} from './CrudCreateItemPage'
import {CrudListPage} from './CrudListPage'
import {useAdminState} from '../../../hooks/common/useAdminState'
import {getEntityByEID} from "iso";
import {isItemOfAttr} from "@shammasov/mydux";


export const fieldMetaToProProps =<
    EID extends string,
    Attrs extends AnyAttributes,
    K extends keyof EntitySlice<Attrs, EID>['exampleItem']
>  (entity: EntitySlice<Attrs, EID>, key: K, item?: Partial<ItemByAttrs<Attrs,EID>>) =>{
    const meta = entity.attributes[key]
    const state = useAdminState()
    const getLinkedResourceEnum = () => {
        if (isItemOfAttr(meta)) {
            const linkedResource: EntitySlice<any, any> = getEntityByEID(meta.linkedEID)
            const list = linkedResource.selectors.selectAll(state)
            return linkedResource.asValueEnum(list)
        }
        return undefined
    }
    const getLinkedResourceOptions = () => {
        if (isItemOfAttr(meta)) {
            const linkedResource: EntitySlice<any, any> = getEntityByEID(meta.linkedEID)
            const list = linkedResource.selectors.selectAll(state)
            return linkedResource.asOptions(list)
        }
        return undefined
    }
    const proProp = ({
        name: key,
        label: meta.headerName,
        required: entity.attributes[key].required,
        placeholder: entity.attributes[key].headerName,
        valueEnum: getLinkedResourceEnum(),
        options:getLinkedResourceOptions()
    })

    return proProp
}


type CrudBaseRenderProps <
    EID extends string,
    Attrs extends AnyAttributes,
>  =  {
    entity: EntitySlice<Attrs, EID>
    form?: FormInstance<EntitySlice<Attrs, EID>['exampleItem']>
}

export type CrudListRenderProps<
    EID extends string,
    Attrs extends AnyAttributes,
>  = CrudBaseRenderProps<EID,Attrs> & {verb: 'LIST', }




export type ItemChapterProps<
    EID extends string,
    Attrs extends AnyAttributes,
> = {
    entity: EntitySlice<Attrs, EID>
    onImport?: Function
    renderForm: (props: CrudFormRenderProps<EID, Attrs> ) => React.ReactNode
    renderItemInfo?: (props: CrudFormRenderProps<EID, Attrs>) => React.ReactNode
    renderList: (props: CrudListRenderProps<EID , Attrs>) => React.ReactNode
}

export type CrudFormRender<
    EID extends string,
    Attrs extends AnyAttributes,
>  = (props: CrudFormRenderProps<EID, Attrs>) => React.ReactNode
export type CrudListRender<
    EID extends string,
    Attrs extends AnyAttributes,
>  = (props: CrudListRenderProps<EID, Attrs>) => React.ReactNode
export default <
        EID extends string,
        Attrs extends AnyAttributes,
        Res extends EntitySlice<Attrs, EID>
    >
    ({
         entity,renderItemInfo,
         renderForm, renderList}: ItemChapterProps<EID, Attrs> ) => {
    const pathRes = usePathnameResource()
    if(pathRes.entity.EID === entity.EID) {
       // if (pathRes.verb === 'VIEW')
        //    return <EditItemPage {...pathRes} renderForm={renderForm}  />
        if (pathRes.verb === 'EDIT')
            return <CrudEditItemPage {...pathRes} renderForm={renderForm} renderItemInfo={renderItemInfo} />
        if (pathRes.verb === 'CREATE')
            return <CrudCreateItemPage {...pathRes} renderForm={renderForm} />
        if (pathRes.verb === 'LIST')
            return <CrudListPage renderList={renderList} {...pathRes}/>

    }
    return <div>Expected  {entity.EID} Resource, found {pathRes.entity.EID}</div>

}
