import {Button, ButtonProps, Popconfirm} from 'antd'
import {AntdIcons} from './AntdIcons'
import {useNavigate} from 'react-router-dom'
import {AnyAttributes} from "@shammasov/mydux";
import {AnyEntity} from "iso";

export type DeleteButtonProps<Attrs extends AnyAttributes,EID extends string> = {
    entity?:AnyEntity
    id?: string
    onDeleted?: (id: string | undefined) => any
} & ButtonProps

export default <EID extends string, Attrs extends AnyAttributes>({entity,id,onDeleted, onClick, ...props}: DeleteButtonProps<Attrs,EID>) => {

    const navigate = useNavigate()

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
