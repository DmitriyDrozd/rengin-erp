import React from 'react';
import { useHistory } from 'react-router';
import getCrudPathname from '../../hooks/getCrudPathname';
import { AntdIcons } from '../elements/AntdIcons';
import {
    Button,
    Form,
    Modal
} from 'antd';
import DeleteButton from '../elements/DeleteButton';
import CancelButton from '../elements/CancelButton';
import { sleep } from '@sha/utils';
import { useContextEditor } from './chapter-modal/useEditor';
import { layoutPropsModalForm } from '../form/ModalForm';


const formItemLayout = {
    labelCol: {
        xs: {span: 24},
        sm: {span: 6},
    },
    wrapperCol: {
        xs: {span: 24},
        sm: {span: 14},
    },
};

interface IssueModalProps {
    children: React.ReactNode,
    title?: string,
    restrictedAccess?: boolean
}

export default ({children, title, restrictedAccess}: IssueModalProps) => {
    const editor = useContextEditor();
    const history = useHistory();
    const modalTitle = title || editor.resource.getItemName(editor.item);

    const onSave = async () => {
        editor.save();

        if (editor.mode === 'create') {
            await sleep(100);

            const { resource, item } = editor;
            const itemId = item[resource.idProp];
            const itemPath = getCrudPathname(resource).edit(itemId);

            history.replace(itemPath)
        } else {
            onBack();
        }
    };

    const onDelete = async () => {
        onBack();
        await sleep(100);
        editor.remove();
    };

    const onBack = () => {
        history.goBack();
    };

    const onCancel = () => {
        // if (editor.mode == 'edit')
        //     onSave();
        // else
        history.goBack();
    };

    const buttons = [
        <DeleteButton onDeleted={onDelete}/>,
        <CancelButton onCancel={onBack} disabled={!editor.hasChanges}/>,
        <Button type={'primary'} disabled={!editor.hasChanges} icon={<AntdIcons.SaveOutlined/>}
                onClick={onSave}>Сохранить</Button>
    ];

    const actions = restrictedAccess ? [buttons[1], buttons[2]] : [...buttons];

    return (
        <Modal
            open
            width={'80%'}
            style={{top: '20px'}}
            title={modalTitle}
            footer={actions}
            onCancel={onCancel}
        >
            <Form
                {...formItemLayout}
                style={{maxWidth: 800}}
                {...layoutPropsModalForm}
                layout={'horizontal'}
            >
                {children}
            </Form>
        </Modal>
    );
}

