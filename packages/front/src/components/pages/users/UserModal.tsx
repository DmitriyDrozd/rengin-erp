import { USERS } from 'iso/src/store/bootstrap';
import React from 'react';
import {
    EditorContext,
    useEditor
} from '../chapter-modal/useEditor';
import BaseEditModal from '../BaseItemModal';
import GenericRenFields from '../../form/GenericRenFields';
import { usersEditor } from '../../../editors/usersEditor';

export default ({id}: { id: string }) => {
    const useEditorData = useEditor(usersEditor, id);
    const {removed, clientsUserNumber, ...propsToRender} = USERS.properties;

    return (
        <EditorContext.Provider value={useEditorData}>
            <BaseEditModal>
                <GenericRenFields list={Array.from(Object.values(propsToRender))}/>
            </BaseEditModal>
        </EditorContext.Provider>
    );
}