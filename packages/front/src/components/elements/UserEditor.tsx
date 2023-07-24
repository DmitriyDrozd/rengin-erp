import {WithValueProps} from '@sha/react-fp'
import {UserVO} from 'iso/src/store/bootstrap/repos/user-schema'
import {Button, Form, Input, Select, Space} from 'antd'
import useUser from '../../hooks/useUser'
import {useEffect, useState} from 'react'
import {key} from 'ionicons/icons'
import { useForm } from "react-hook-form";
import EditorFooter from './EditorFooter'
import {FieldRender} from '../grid/createColumns'


export type ItemEditor<T> =React.ComponentType<{
    item:Partial<T>,isNew?:boolean, onCancel: Function, onSave: (item: T) => any
}>
export default ({item, onCancel, onSave, isNew}:{item:Partial< UserVO>,isNew?:boolean, onCancel: Function, onSave: (item: UserVO) => any}) => {


    const [state, setState] = useState(item)
    const onPropChanged = <K extends keyof UserVO>(prop: K) => (d: UserVO[K]) => {
        console.log('onPropChanged', prop, d)
        setState({...state, [prop]: d})
    }

    const onOk = () => {
        onSave(state)
    }
    /*
    const { register, handleSubmit, setValue, errors } = useForm();

    useEffect(() => {
        // antd のコンポーネントは ref が使えないためこの書き方が必要
        // そのようなコンポーネントのために用意されている react-hook-form-input も使えない
        // https://react-hook-form.com/get-started#WorkwithUIlibrary
        register({ name: "select" });
        register({ name: "startDate" }, { required: true });
        register({ name: "lastName" }, { required: true });
        // デフォルト値を store にセット、コンポーネントには別途 defaultValue でセットしている
        // このやりかたがよいか自信がないがとりあえず
        setValue("select", select);
        setValue("lastName", lastName);
    }, [register, setValue, select, lastName]);

    // Input は event が渡されてくる
    const getChangeHandlerWithEvent = name => event =>
        setValue(name, event.target.value);

    // Select や DatePicker は value が渡されてくる
    const getChangeHandlerWithValue = name => value => {
        setValue(name, value);
    };

    const hasErrorClass = name => ({ className: errors[name] && "has-error" });

    const errorDetail = (name, message) =>
        errors[name] && <div className="ant-form-explain">{message}</div>;

*/


    return <Form     labelCol={{ span: 4 }}
                     wrapperCol={{ span: 14 }}
                     layout="horizontal">
        <Form.Item label="userId">
            <div>{state.userId}</div>
        </Form.Item>
                <Form.Item label="email">
                    <Input value={state.email} onChange={e => onPropChanged('email')(e.target.value)}/>
                </Form.Item>
                <Form.Item label="Пароль">
                    <Input value={state.password} onChange={e => onPropChanged('password')(e.target.value)}/>
                </Form.Item>
        <Form.Item label="ФИО">

                <Input placeholder="Фамилия Имя Отчество полностью" value={state.fullName} onChange={e => onPropChanged('fullName')(e.target.value)}  />

        </Form.Item>
                <Form.Item label="Роль">
                    <Select value={state.role} onSelect={e => onPropChanged('role')(e)}>
                        <Select.Option value="root">Root</Select.Option>
                        <Select.Option value="admin">Admin</Select.Option>
                        <Select.Option value="manager">Manager</Select.Option>
                        <Select.Option value="booker">Booker</Select.Option>
                    </Select>
                </Form.Item>
        <Form.Item label="Должность">

                <Input placeholder="Должность в организации" value={state.title} onChange={e => onPropChanged('title')(e.target.value)}  />

        </Form.Item>
            <EditorFooter onCancel={onCancel} onSave={onOk} saveText={isNew ? 'Создать' : 'Сохранить'} />


            </Form>
}