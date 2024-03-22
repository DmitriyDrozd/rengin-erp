import { USERS } from 'iso/src/store/bootstrap';
import React from 'react';
import {
    EditorContext,
    useEditor
} from '../chapter-modal/useEditor';
import BaseEditModal from '../BaseItemModal';
import GenericRenFields from '../../form/GenericRenFields';
import { usersEditor } from '../../../editors/usersEditor';

const EditEmployeeModal = ({ roles, id }: { roles: string[], id: string }) => {
    const useEditorData = useEditor(usersEditor, id);
    const {removed, clientsUserNumber, ...propsToRender} = USERS.properties;
    const list = Array.from(Object.values(propsToRender));
    const customOptions = roles.map(r => ({ value: r, label: r }));

    return (
        <EditorContext.Provider value={useEditorData}>
            <BaseEditModal>
                <GenericRenFields list={list} customOptions={customOptions}/>
            </BaseEditModal>
        </EditorContext.Provider>
    );
}

export default EditEmployeeModal;
