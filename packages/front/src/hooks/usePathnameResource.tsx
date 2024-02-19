import {useLocation} from 'react-router'
import {useSelector} from 'react-redux'
import {ENTITIES_LIST} from "iso";


export default () => {

    const {pathname} = useLocation()
    const entity = ENTITIES_LIST.find(r => pathname.includes(r.EID))
    if(!entity)
        throw new Error('Resource for page ' + pathname+' is not found')
    const id = pathname.split('/').pop()
    const item = useSelector(entity.selectors.selectById(id))
    const verb = pathname.endsWith(entity.EID)
        ? 'LIST'
        : pathname.endsWith('create')
            ? 'CREATE'
            : 'EDIT'

    return verb === 'EDIT' ? {
        entity,
        verb,
        item,
        id
    } : {
        entity,
        verb
    }
}