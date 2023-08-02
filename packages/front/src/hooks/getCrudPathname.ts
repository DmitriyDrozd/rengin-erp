import {ResourceType} from 'iso/src/store/bootstrap/resourcesList'

export default (resource:ResourceType ) => ({

    view: () => '/app/in/'+resource.collection,
    create: () => '/app/in/'+resource.collection+'/create',
    edit: (id: string) => '/app/in/'+resource.collection+'/'+id,
})


