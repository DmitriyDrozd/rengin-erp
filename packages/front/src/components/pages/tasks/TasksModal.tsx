import { Form } from 'antd';
import { EXPENSES } from 'iso/src/store/bootstrap';
import TASKS, {
    paymentStatusesList,
    taskStatusesList
} from 'iso/src/store/bootstrap/repos/tasks';
import React, {
    FC,
    useEffect,
} from 'react';
import { tasksEditor } from '../../../editors/taskEditor';
import { layoutPropsModalForm } from '../../form/ModalForm';
import RenField from '../../form/RenField';
import {
    EditorContext,
    useContextEditor,
    useEditor
} from '../chapter-modal/useEditor';
import BaseEditModal from '../BaseItemModal';

interface TasksModalProps {
    id: string,
    newClientsNumber: string,
    disabledEdit?: boolean
}

export const TasksModal: FC<TasksModalProps> = ({id, newClientsNumber, disabledEdit}) => {
    const useEditorData = useEditor(tasksEditor, id);

    useEffect(() => {
        if (!useEditorData.item[TASKS.clientsNumberProp]) {
            useEditorData.updateItemProperty(TASKS.clientsNumberProp)(newClientsNumber);
        }
    }, []);

    const title = useEditorData.mode === 'create'
        ? 'Новая задача' : TASKS.getTaskTitle(useEditorData.item);

    return (
        <EditorContext.Provider value={useEditorData}>
            <BaseEditModal title={title} restrictedAccess={disabledEdit}>
                <Form
                    style={{maxWidth: 800}}
                    {...layoutPropsModalForm}
                    layout={'horizontal'}
                >
                    <RenField meta={TASKS.properties.clientsTaskNumber}/>
                    <RenField meta={TASKS.properties.description}/>
                    <RenField meta={TASKS.properties.estimatedTime} />
                    <RenField meta={TASKS.properties.spentTime} />
                    <RenField meta={TASKS.properties.taskStatus}/>
                    <RenField meta={TASKS.properties.paymentStatus}/>
                </Form>
            </BaseEditModal>
        </EditorContext.Provider>
    );
}
