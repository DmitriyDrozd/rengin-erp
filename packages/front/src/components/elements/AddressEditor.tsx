import {WithValueProps} from '@sha/react-fp'
import {UserVO} from 'iso/src/store/bootstrap/repos/user-schema'
import {Button, Form, Input, Select, Space} from 'antd'
import useUser from '../../hooks/useUser'
import {useEffect, useState} from 'react'
import {key} from 'ionicons/icons'
import { useForm } from "react-hook-form";
import EditorFooter from './EditorFooter'
import {FieldRender} from '../grid/createColumns'
import {AddressVO} from 'iso/src/store/bootstrap/repos/addresses-schema'
import {z} from 'zod'
import {zodResolver} from '@hookform/resolvers/zod'
import { DevTool } from "@hookform/devtools";
import {AntReactHookFormItem} from './AntReactHookFormItem'

export default ({item, onCancel, onSave,isNew}:{item: Partial<AddressVO>,isNew?:boolean, onCancel: Function, onSave: (item: AddressVO) => any}) => {

    const schema = z.object({
clientId: z.string(),
        kpp: z.string().length(9, 'КПП должен состоянть из 9 цифр').regex(/^[0-9]*$/,'В КПП доспустиы только цифры').optional(),
       address_city: z.string(),
        address_region: z.string(),
        address_street: z.string(),
        responsibleEngineer: z.string().optional(),
        email: z.string().optional(),
companyName: z.string().optional(),
        brand: z.string().optional(),
legalName: z.string({})   })

    const { register, handleSubmit, setValue,formState,getValues,control  } = useForm<AddressVO>({defaultValues: item as any as AddressVO});

    const errors = formState.errors
    // Input は event が渡されてくる
    const getChangeHandlerWithEvent = name => event =>
        setValue(name, event.target.value);

    // Select や DatePicker は value が渡されてくる
    const getChangeHandlerWithValue = name => value => {
        setValue(name, value);
    };

    const hasErrorClass = name => ({ className: errors[name]  ? "has-error" : ""});



    const errorDetail = (name, message) =>
        errors[name] && <div className="ant-form-explain">{message}</div>;



    const currentValues = getValues()

    return [<Form     labelCol={{ span: 4 }}
                     wrapperCol={{ span: 14 }}
                     layout="horizontal" onFinish={(handleSubmit((data) =>{
                        console.log("handleSubmit", data)
                         onSave(data)}
                    ))} >
        <AntReactHookFormItem label="Заказчик" control={control} name={'brand'} >
            <Input />
        </AntReactHookFormItem>
        <AntReactHookFormItem label="Юр. Лицо" control={control} name={'companyName'} >
            <Input />
        </AntReactHookFormItem>
        <AntReactHookFormItem label="Регион" control={control} name={'address_region'}>
            <Input />
        </AntReactHookFormItem>
        <AntReactHookFormItem label="Город" control={control} name={'address_city'}>
            <Input />
        </AntReactHookFormItem>
        <AntReactHookFormItem label="Улица" control={control} name={'address_street'}>
            <Input/>
        </AntReactHookFormItem>
        <AntReactHookFormItem label="КПП" control={control} name={'kpp'}>

            <Input   />

        </AntReactHookFormItem>
        <AntReactHookFormItem label="Отв. инженер" control={control} name={'responsibleEngineer'}>

            <Input  />

        </AntReactHookFormItem>
        <EditorFooter onCancel={onCancel} onSave={() =>onSave(getValues())} saveText={isNew ? 'Создать' : 'Сохранить'} />


    </Form>,     <DevTool control={control} />]

}