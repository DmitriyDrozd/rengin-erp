import {Button} from 'antd'
import {AntdIcons} from './AntdIcons'
import {useHistory} from 'react-router'
import usePathnameResource from '../../hooks/usePathnameResource'
import getCrudPathname from '../../hooks/getCrudPathname'
import {AnyFieldsMeta, ExtractResource, ItemWithId} from 'iso/src/store/bootstrap/core/createResource'

export type CrudCreateButtonProps<RID extends string, Fields extends AnyFieldsMeta> = {
    resource?: ExtractResource<RID, Fields>
    defaultProps?: Partial<ItemWithId<RID, Fields>>
    href?: string
    onCreate?: (props?: Partial<ItemWithId<RID, Fields>>) => any
}
export default <RID extends string, Fields extends AnyFieldsMeta>({resource,defaultProps,href}: CrudCreateButtonProps<RID,Fields>) => {
    const pathRes = usePathnameResource()
    let url = href || getCrudPathname(pathRes.resource).create()
    if(resource)
        url = getCrudPathname(resource).create(defaultProps)
    const history = useHistory()

    const onButtonClick = (e: any) => {
        history.push(url)
    }
    return <Button type={'primary'} icon={<AntdIcons.PlusOutlined/>} onClick={onButtonClick}></Button>
}