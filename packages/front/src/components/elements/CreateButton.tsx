import {Button} from 'antd'
import {AntdIcons} from './AntdIcons'
import { useNavigate } from 'react-router-dom';
import usePathnameResource from '../../hooks/usePathnameResource'
import getCrudPathname from '../../hooks/getCrudPathname'
import {AnyAttributes, EntitySlice, ExtractVOByEntitySlice, ItemByAttrs} from "@shammasov/mydux"

export type CrudCreateButtonProps<Attrs extends AnyAttributes,EID extends string = string> = {
    resource?: EntitySlice<Attrs,EID>
    defaultProps?: Partial<ItemByAttrs<Attrs>>
    href?: string
    onCreate?: (props?: Partial<ItemByAttrs<Attrs>>) => any
}

export default <EID extends string, Attrs extends AnyAttributes>({resource,defaultProps,href,onCreate}: CrudCreateButtonProps<Attrs,EID>) => {
    const pathRes = usePathnameResource()
    let url = href || getCrudPathname(pathRes.resource).create()
    if(resource)
        url = getCrudPathname(resource).create(defaultProps)
    const navigate = useNavigate()

    const onButtonClick = (e: any) => {
        navigate(url)
    }
    return <Button type={'primary'} icon={<AntdIcons.PlusOutlined/>} onClick={onCreate||onButtonClick}></Button>
}
