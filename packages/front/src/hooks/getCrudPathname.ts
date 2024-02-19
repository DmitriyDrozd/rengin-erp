import {AnyAttributes, EntitySlice} from "@shammasov/mydux";


export default <Attrs extends AnyAttributes,EID extends string>(entity:EntitySlice<Attrs,EID> ) => ({
    view: () => '/app/in/'+entity.EID,
    create: (defaultProps:Partial< Record<keyof Attrs, string>> = {}) =>
        (['issue','user','brand'].includes(entity.EID))
            ? '/app/in/'+entity.EID+'/#create'
            : '/app/in/'+entity.EID+'/create?'+(new URLSearchParams(defaultProps as any).toString()),
    edit: (id: string) =>
        (['issue','user','brand'].includes(entity.EID))
            ? '/app/in/'+entity.EID+'/#'+id
            :'/app/in/'+entity.EID+'/'+id,
})


