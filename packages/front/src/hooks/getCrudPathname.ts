import {AnyFieldsMeta, Resource} from 'iso/src/store/bootstrap/core/createResource'

const CRUD_NAV_ITEMS = [
    'issue',
    'user',
    'brand',
    'employee',
    'expense',
    'task',
];

const root = '/app/in/';

export default <RID extends string, Fields extends AnyFieldsMeta>(resource:Resource<RID,Fields>, href?: string) => {
    const resourceHref = href ? `${resource.collection}/${href}` : resource.collection;
    const collectionRef = root + resourceHref;

    return {
        view: () => collectionRef,
        create: (defaultProps:Partial< Record<keyof Fields, string>> = {}) =>
            (CRUD_NAV_ITEMS.includes(resource.rid))
                ? collectionRef+'/#create'
                : collectionRef+'/create?'+(new URLSearchParams(defaultProps as any).toString()),
        edit: (id: string) =>
            (CRUD_NAV_ITEMS.includes(resource.rid))
                ? collectionRef+'/#'+id
                : collectionRef+'/'+id,
    };
};
