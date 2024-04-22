import {
    AnyFieldsMeta,
    ItemWithId,
    Resource
} from 'iso/src/store/bootstrap/core/createResource';
import React from 'react';
import usePathnameResource from '../../../hooks/usePathnameResource';
import { FormInstance } from '@ant-design/pro-components';
import {
    CrudEditItemPage,
    CrudFormRenderProps
} from './CrudEditItemPage';
import { CrudCreateItemPage } from './CrudCreateItemPage';
import { CrudListPage } from './CrudListPage';
import { isItemOfMeta } from 'iso/src/store/bootstrap/core/valueTypes';
import { getRes } from 'iso/src/store/bootstrap/resourcesList';
import { useFrontStateSelector } from '../../../hooks/common/useFrontSelector';


export const fieldMetaToProProps = <
    RID extends string,
    Fields extends AnyFieldsMeta,
    K extends keyof Resource<RID, Fields>['exampleItem']
>(resource: Resource<RID, Fields>, key: K, item?: Partial<ItemWithId<RID, Fields>>) => {
    const meta = resource.properties[key];
    const state = useFrontStateSelector();

    const getLinkedResourceWithOptions = () => {
        const linkedResource: Resource<any, any> = getRes(meta.linkedResourceName);
        const list = linkedResource.selectList(state);
        const result = meta.filterLinkedResourceItems ? meta.filterLinkedResourceItems(list, item) : list;

        return {linkedResource, result};
    };

    const getLinkedResourceEnum = () => {
        if (isItemOfMeta(meta)) {
            const {linkedResource, result} = getLinkedResourceWithOptions();

            return linkedResource.asValueEnum(result);
        }

        return undefined;
    };
    const getLinkedResourceOptions = () => {
        if (isItemOfMeta(meta)) {
            const {linkedResource, result} = getLinkedResourceWithOptions();

            return linkedResource.asOptions(result);
        }

        return undefined;
    };

    return {
        name: key,
        label: meta.headerName,
        required: resource.properties[key].required,
        placeholder: resource.properties[key].headerName,
        valueEnum: getLinkedResourceEnum(),
        options: getLinkedResourceOptions()
    };
};


type CrudBaseRenderProps<
    RID extends string,
    Fields extends AnyFieldsMeta,
> = {
    resource: Resource<RID, Fields>
    form?: FormInstance<Resource<RID, Fields>['exampleItem']>
}

export type CrudListRenderProps<
    RID extends string,
    Fields extends AnyFieldsMeta,
> = CrudBaseRenderProps<RID, Fields> & { verb: 'LIST', }


export type ItemChapterProps<
    RID extends string,
    Fields extends AnyFieldsMeta,
> = {
    resource: Resource<RID, Fields>
    onImport?: Function
    renderForm: (props: CrudFormRenderProps<RID, Fields>) => React.ReactNode
    renderItemInfo?: (props: CrudFormRenderProps<RID, Fields>) => React.ReactNode
    renderList: (props: CrudListRenderProps<RID, Fields>) => React.ReactNode,
    isViewMode?: boolean,
}

export type CrudFormRender<
    RID extends string,
    Fields extends AnyFieldsMeta,
> = (props: CrudFormRenderProps<RID, Fields>) => React.ReactNode
export type CrudListRender<
    RID extends string,
    Fields extends AnyFieldsMeta,
> = (props: CrudListRenderProps<RID, Fields>) => React.ReactNode

export default <
    RID extends string,
    Fields extends AnyFieldsMeta,
    Res extends Resource<RID, Fields>
>({
      resource,
      renderItemInfo,
      renderForm,
      renderList,
      isViewMode,
  }: ItemChapterProps<RID, Fields>) => {
    const pathRes = usePathnameResource();

    if (pathRes.resource.collection === resource.collection) {
        // if (pathRes.verb === 'VIEW')
        //    return <EditItemPage {...pathRes} renderForm={renderForm}  />

        if (pathRes.verb === 'EDIT') {
            return (
                <CrudEditItemPage
                    {...pathRes}
                    renderForm={renderForm}
                    renderItemInfo={renderItemInfo}
                    isViewMode={isViewMode}
                />
            );
        }

        if (pathRes.verb === 'CREATE') {
            return (
                <CrudCreateItemPage {...pathRes} renderForm={renderForm}/>
            );
        }

        if (pathRes.verb === 'LIST') {
            return (
                <CrudListPage
                    isViewMode={isViewMode}
                    renderList={renderList}
                    {...pathRes}
                />
            );
        }
    }

    return (
        <div>Expected {resource.collection} Resource, found {pathRes.resource.collection}</div>
    );
}
