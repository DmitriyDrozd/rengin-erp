import {useLocation} from 'react-router'
import {useSelector} from 'react-redux'
import {RESOURCES_LIST} from "iso";

export const RESOURCE_VERBS = ['LIST', 'VIEW',  'EDIT', 'CREATE'] as const
export type Verb = typeof RESOURCE_VERBS[number]

export default () => {

    const {pathname} = useLocation()
    const resource = RESOURCES_LIST.find(r => pathname.includes(r.RID))
    if(!resource)
        throw new Error('Resource for page ' + pathname+' is not found')
    const id = pathname.split('/').pop()
    const item = useSelector(resource.selectors.selectById(id))
    const verb: Verb = pathname.endsWith(resource.RID)
        ? 'LIST'
        : pathname.endsWith('create')
            ? 'CREATE'
            : 'EDIT'

    return verb === 'EDIT' ? {
        resource,
        verb,
        item,
        id
    } : {
        resource,
        verb
    }
}