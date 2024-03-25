import {AnyFieldsMeta, Resource} from 'iso/src/store/bootstrap/core/createResource'


export default <RID extends string, Fields extends AnyFieldsMeta>(resource:Resource<RID,Fields> ) => ({
    view: () => '/app/in/'+resource.collection,
    create: (defaultProps:Partial< Record<keyof Fields, string>> = {}) =>
        (['issue','user','brand','employee'].includes(resource.rid))
            ? '/app/in/'+resource.collection+'/#create'
            : '/app/in/'+resource.collection+'/create?'+(new URLSearchParams(defaultProps as any).toString()),
    edit: (id: string) =>
        (['issue','user','brand','employee'].includes(resource.rid))
            ? '/app/in/'+resource.collection+'/#'+id
            :'/app/in/'+resource.collection+'/'+id,
})


