import {Button, ButtonProps, Popconfirm} from 'antd'
import {AntdIcons} from './AntdIcons'
import {useHistory} from 'react-router'
import {AnyAttributes, EntitySlice, GenericEntitySlice} from "@shammasov/mydux";
import {AnyEntity} from "iso";

export type DeleteButtonProps<Attrs extends AnyAttributes,EID extends string> = {
    resource?:AnyEntity
    id?: string
    onDeleted?: (id: string | undefined) => any
} & ButtonProps

export default <EID extends string, Attrs extends AnyAttributes>({resource,id,onDeleted, onClick, ...props}: DeleteButtonProps<Attrs,EID>) => {

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
