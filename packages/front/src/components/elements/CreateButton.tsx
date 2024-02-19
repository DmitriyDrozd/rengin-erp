import {Button} from 'antd'
import {AntdIcons} from './AntdIcons'
import {useNavigate} from 'react-router-dom';
import usePathnameResource from '../../hooks/usePathnameResource'
import getCrudPathname from '../../hooks/getCrudPathname'
import {AnyAttributes, EntitySlice, ItemByAttrs} from "@shammasov/mydux"

export type CrudCreateButtonProps<Attrs extends AnyAttributes,EID extends string = string> = {
    entity?: EntitySlice<Attrs,EID>
    defaultProps?: Partial<ItemByAttrs<Attrs,EID>>
    href?: string
    onCreate?: (props?: Partial<ItemByAttrs<Attrs,EID>>) => any
}

export default <EID extends string, Attrs extends AnyAttributes>({entity,defaultProps,href,onCreate}: CrudCreateButtonProps<Attrs,EID>) => {
    const pathRes = usePathnameResource()
    let url = href || getCrudPathname(pathRes.entity).create()
    if(entity)
        url = getCrudPathname(entity).create(defaultProps)
    const navigate = useNavigate()

    const onButtonClick = (e: any) => {
        navigate(url)
    }
    return <Button type={'primary'} icon={<AntdIcons.PlusOutlined/>} onClick={onCreate||onButtonClick}></Button>
}
