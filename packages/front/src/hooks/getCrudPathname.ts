import {EntitySlice,AnyAttributes} from "@shammasov/mydux";


export default <Attrs extends AnyAttributes,EID extends string>(resource:EntitySlice<Attrs,EID> ) => ({
    view: () => '/app/in/'+resource.EID,
    create: (defaultProps:Partial< Record<keyof Attrs, string>> = {}) =>
        (['issue','user','brand'].includes(resource.EID))
            ? '/app/in/'+resource.EID+'/#create'
            : '/app/in/'+resource.EID+'/create?'+(new URLSearchParams(defaultProps as any).toString()),
    edit: (id: string) =>
        (['issue','user','brand'].includes(resource.EID))
            ? '/app/in/'+resource.EID+'/#'+id
            :'/app/in/'+resource.EID+'/'+id,
})


