import {ResourceName} from 'iso/src/store/bootstrap/resourcesList'

import {AnyFieldsMeta, FieldsWithIDMeta, ItemWithId, Resource} from 'iso/src/store/bootstrap/core/createResource'
import {Meta, MetaType} from 'iso/src/store/bootstrap/core/valueTypes'
declare module "ag-grid-community"{
    interface ColDef<TData = any, TValue = any,  RID extends string = string,
        Fields extends AnyFieldsMeta = AnyFieldsMeta,Prop extends keyof TData = keyof TData> {
        resource: Resource<RID, Fields>
        fieldMeta:  Resource<RID, Fields>['properties'][Prop]
        fieldName: Prop

    }
}