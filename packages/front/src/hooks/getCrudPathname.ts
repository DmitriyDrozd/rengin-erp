import {AnyFieldsMeta, Resource} from 'iso/src/store/bootstrap/core/createResource'

const CRUD_NAV_ITEMS = [
    'issue',
    'user',
    'brand',
    'employee',
    'expense',
    'task',
];

export default <RID extends string, Fields extends AnyFieldsMeta>(resource:Resource<RID,Fields> ) => ({
    view: () => '/app/in/'+resource.collection,
    create: (defaultProps:Partial< Record<keyof Fields, string>> = {}) =>
        (CRUD_NAV_ITEMS.includes(resource.rid))
            ? '/app/in/'+resource.collection+'/#create'
            : '/app/in/'+resource.collection+'/create?'+(new URLSearchParams(defaultProps as any).toString()),
    edit: (id: string) =>
        (CRUD_NAV_ITEMS.includes(resource.rid))
            ? '/app/in/'+resource.collection+'/#'+id
            :'/app/in/'+resource.collection+'/'+id,
})


