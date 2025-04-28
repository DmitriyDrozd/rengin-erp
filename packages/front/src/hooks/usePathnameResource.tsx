import { useLocation } from 'react-router';
import { RESOURCES_LIST } from 'iso/src/store/bootstrap/resourcesList';
import { useSelector } from 'react-redux';

export const RESOURCE_VERBS = ['LIST', 'VIEW', 'EDIT', 'CREATE'] as const;
export type Verb = typeof RESOURCE_VERBS[number]

export default () => {
    const { pathname } = useLocation();
    const path = pathname.toLowerCase();
    const resource = RESOURCES_LIST.find(r => path.includes(r.collection.toLowerCase()));

    if (!resource) {
        throw new Error('Resource for page ' + path + ' is not found');
    }

    const id = pathname.split('/').pop();
    const item = useSelector(resource.selectById(id));
    const verb: Verb = path.endsWith(resource.collection.toLowerCase())
        ? 'LIST'
        : path.endsWith('create')
            ? 'CREATE'
            : 'EDIT';

    return verb === 'EDIT' ? {
        resource,
        verb,
        item,
        id
    } : {
        resource,
        verb
    };
}