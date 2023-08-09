import {ButtonProps, Popconfirm} from 'antd'
import {Button} from 'antd'
import {AntdIcons} from './AntdIcons'
import {useHistory} from 'react-router'
import usePathnameResource from '../../hooks/usePathnameResource'
import getCrudPathname from '../../hooks/getCrudPathname'
import {AnyFieldsMeta, ExtractResource, ItemWithId} from 'iso/src/store/bootstrap/core/createResource'

export type DeleteButtonProps<RID extends string, Fields extends AnyFieldsMeta> = {
    resource?: ExtractResource<RID, Fields>
    id?: string
    onDeleted?: (id: string | undefined) => any
} & ButtonProps
export default <RID extends string, Fields extends AnyFieldsMeta>({resource,id,onDeleted, onClick, ...props}: DeleteButtonProps<RID,Fields>) => {

    const history = useHistory()

    const onButtonClick = () => {
      if(onDeleted)  onDeleted(id)
    }
    return <Popconfirm
        title="Удаление"

        description="Вы уверениы что хотите удалить записи?"
        okText="Удалить"
        cancelText="Отмена"
        onConfirm={onButtonClick}
    ><Button danger={true} icon={<AntdIcons.DeleteFilled/>} {...props}>Удалить</Button></Popconfirm>
}
