import {Popconfirm} from 'antd'
import {Button} from 'antd'
import {AntdIcons} from './AntdIcons'
import {useHistory} from 'react-router'
import usePathnameResource from '../../hooks/usePathnameResource'
import getCrudPathname from '../../hooks/getCrudPathname'
import {AnyFieldsMeta, ExtractResource, ItemWithId} from 'iso/src/store/bootstrap/core/createResource'

export type DeleteButtonProps<RID extends string, Fields extends AnyFieldsMeta> = {
    resource?: ExtractResource<RID, Fields>
    id?: string
    onDeleted?: Function
}
export default <RID extends string, Fields extends AnyFieldsMeta>({resource,id}: DeleteButtonProps<RID,Fields>) => {

    const history = useHistory()

    const onButtonClick = () => {

    }
    return <Popconfirm
        title=""
        description="Are you sure to delete this task?"
        okText="Продолжить"
        cancelText="Отмена"
        onConfirm={onButtonClick}
    ><Button danger={true} icon={<AntdIcons.DeleteFilled/>} >Удалить</Button></Popconfirm>
}
