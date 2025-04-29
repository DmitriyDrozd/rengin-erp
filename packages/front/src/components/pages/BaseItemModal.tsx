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
import { useNotifications } from '../../hooks/useNotifications';


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
    restrictedAccess?: boolean,
    href?: string,
}

export default ({children, title, restrictedAccess, href}: IssueModalProps) => {
    const editor = useContextEditor();
    const history = useHistory();
    const notifications = useNotifications();
    const modalTitle = title || editor.resource.getItemName(editor.item);

    const onSave = async () => {
        editor.save();
        notifications.sendAllPending();

        if (editor.mode === 'create') {
            await sleep(100);

            const { resource, item } = editor;
            const itemId = item[resource.idProp];
            const itemPath = getCrudPathname(resource, href).edit(itemId);

            history.replace(itemPath)
        } else {
            history.goBack();
        }
    };

    const onDelete = async () => {
        onBack();
        await sleep(100);
        editor.remove();
    };

    const onBack = () => {
        notifications.discardAllPending();
        history.goBack();
    };

    const onCancel = () => {
        if (editor.mode == 'edit' && !restrictedAccess) {
            onSave();
        } else {
            onBack();
        }
    };

    const buttons = [
        <DeleteButton onDeleted={onDelete} disabled={restrictedAccess} key="delete"/>,
        <CancelButton onCancel={onBack} disabled={!editor.hasChanges} key="cancel"/>,
        <Button type={'primary'} disabled={restrictedAccess || !editor.hasChanges || !editor.isValid} icon={<AntdIcons.SaveOutlined/>}
                onClick={onSave} key="save">Сохранить</Button>
    ];

    const actions = restrictedAccess ? [buttons[1], buttons[2]] : [...buttons];

    return (
        <Modal
            open
            style={{top: '20px', minWidth: '50vw'}}
            title={modalTitle}
            footer={actions}
            onCancel={onCancel}
        >
            <Form
                {...formItemLayout}
                {...layoutPropsModalForm}
                layout={'horizontal'}
            >
                {children}
            </Form>
        </Modal>
    );
}

