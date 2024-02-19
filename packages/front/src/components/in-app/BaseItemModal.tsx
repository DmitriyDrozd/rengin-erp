import React from 'react'
import {useNavigate} from 'react-router-dom'
import {AntdIcons} from '../elements/AntdIcons'
import {Button, Form, Modal} from 'antd'
import DeleteButton from '../elements/DeleteButton'
import CancelButton from '../elements/CancelButton'
import {sleep} from "@shammasov/utils"
import {useContextEditor} from "./chapter-modal/useEditor";
import {layoutPropsModalForm} from "../form/ModalForm";


const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
    },
};

export default ({children}) => {

    const editor = useContextEditor()
    console.log('editor IN MODAL ', editor)
    const navigate = useNavigate()
    const title = editor.entity.getItemName(editor.item)

    const onSave = () =>{
        editor.save()
        onBack()
    }

    const onDelete = async () => {
        onBack()
        await sleep(100)
        editor.remove()
    }

    const onBack = () => {
        navigate(-1)
    }

    const onCancel = () => {
        if(editor.mode=='edit')
        onSave()
        else
            navigate(-1)
    }


    return    <Modal
        width={'80%'}
        style={{top:"20px"}}
        title={title}
        open={true}

        footer={[
            <DeleteButton  onDeleted={onDelete}/>,
            <CancelButton onCancel={onBack}  disabled={!editor.hasChanges} />,
            <Button type={'primary'} disabled={!editor.hasChanges}  icon={<AntdIcons.SaveOutlined/>} onClick={onSave}>Сохранить</Button>
        ]}
        onCancel={onCancel}
    >
        <Form
            {...formItemLayout} style={{ maxWidth: 800 }}
            {
                ...layoutPropsModalForm
            }
            layout={'horizontal'}


        >
            {children}
        </Form>
    </Modal>

}

