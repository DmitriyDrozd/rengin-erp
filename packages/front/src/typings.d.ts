import {AnyAttributes} from 'iso'

declare module "ag-grid-community"{
    interface ColDef<TData = any, TValue = any,  EID extends string = string,
        Attrs extends AnyAttributes = AnyAttributes,Prop extends keyof TData = keyof TData> {
        entity: EntitySlice<Attrs, EID>
        fieldMeta:  EntitySlice<Attrs, EID>['attributes'][Prop]
        fieldName: Prop

    }
}