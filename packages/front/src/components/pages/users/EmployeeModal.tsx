import { EMPLOYEES } from 'iso/src/store/bootstrap';
import React from 'react';
import { employeesditor } from '../../../editors/employeesEditor';
import {
    EditorContext,
    useEditor
} from '../chapter-modal/useEditor';
import BaseEditModal from '../BaseItemModal';
import GenericRenFields from '../../form/GenericRenFields';

const EditEmployeeModal = ({ roles, id }: { roles: string[], id: string }) => {
    debugger;
    const useEditorData = useEditor(employeesditor, id);
    const {removed, clientsEmployeeNumber, ...propsToRender} = EMPLOYEES.properties;
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
