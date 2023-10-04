import {AnyFieldsMeta, Resource} from 'iso/src/store/bootstrap/core/createResource'

declare module "ag-grid-community"{
    interface ColDef<TData = any, TValue = any,  RID extends string = string,
        Fields extends AnyFieldsMeta = AnyFieldsMeta,Prop extends keyof TData = keyof TData> {
        resource: Resource<RID, Fields>
        fieldMeta:  Resource<RID, Fields>['properties'][Prop]
        fieldName: Prop

    }
}