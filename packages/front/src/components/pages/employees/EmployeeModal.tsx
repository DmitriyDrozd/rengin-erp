import { ProCard } from '@ant-design/pro-components';
import { notification } from 'antd';
import {
    EMPLOYEES,
    ISSUES
} from 'iso/src/store/bootstrap';
import BRANDS from 'iso/src/store/bootstrap/repos/brands';
import CONTRACTS from 'iso/src/store/bootstrap/repos/contracts';
import {
    employeeRoleEnum,
    employeeRoleTypes
} from 'iso/src/store/bootstrap/repos/employees';
import LEGALS from 'iso/src/store/bootstrap/repos/legals';
import SITES from 'iso/src/store/bootstrap/repos/sites';
import React, { useState } from 'react';
import { employeesditor } from '../../../editors/employeesEditor';
import PanelRGrid from '../../../grid/PanelRGrid';
import useLedger from '../../../hooks/useLedger';
import { AntdIcons } from '../../elements/AntdIcons';
import {
    EditorContext,
    useEditor
} from '../chapter-modal/useEditor';
import BaseEditModal from '../BaseItemModal';
import GenericRenFields from '../../form/GenericRenFields';

const addingModes = {
    'off': 'off',
    'issues': 'issues',
    'sites': 'sites',
}

const EditEmployeeModal = ({ roles, id }: { roles: string[], id: string }) => {
    const ledger = useLedger()
    const useEditorData = useEditor(employeesditor, id);
    const isEditMode = useEditorData.mode === 'edit';
    const {removed, employeeId, clientsEmployeeNumber, ...propsToRender} = EMPLOYEES.properties;
    const list = [...Array.from(Object.values(propsToRender)), isEditMode && clientsEmployeeNumber].filter(i => !!i);
    const customOptions = roles.map(r => ({ value: r, label: r }));

    const [addingMode, setAddingMode] = useState(addingModes.off);
    const onShowAllItems = (addingMode: string) => () =>  setAddingMode(addingMode);
    const disableAddingMode = () => setAddingMode(addingModes.off);

    const resource= EMPLOYEES;
    const name = resource.getItemName(useEditorData.item);
    const role = useEditorData.item.role === employeeRoleEnum.техник
        ? 'techUserId' : 'clientsEngineerUserId';
    const sites = ledger.sites.list.filter(s => addingMode === addingModes.sites ? s[role] !== id : s[role] === id);
    const issues = ledger.issues.list.filter(s => addingMode === addingModes.issues ? s[role] !== id : s[role] === id);

    const onAddToItems = (list, name: string, idProp: string) => (selectedIds: string[], updateCollection: (updated: any[]) => void) => {
        const updated = list
            .filter(s => selectedIds.includes(s[idProp]))
            .map(s => ({
                ...s,
                [role]: id,
            }));

        updateCollection(updated);
        notification.open({
            message: useEditorData.item.role + ' добавлен к ' + name,
            type: 'success'
        })
    };
    return (
        <EditorContext.Provider value={useEditorData}>
            <BaseEditModal>
                <GenericRenFields list={list} customOptions={customOptions}/>
                <ProCard tabs={{ type: 'card' }}>
                    <ProCard.TabPane key="tab1" tab="Объекты">
                        <PanelRGrid
                            onCancelClick={disableAddingMode}
                            onShowAllItems={onShowAllItems(addingModes.sites)}
                            onAddToItems={onAddToItems(ledger.sites.list, 'объектам', SITES.idProp)}
                            createItemProps={{ [role]: id }}
                            title={name}
                            resource={SITES}
                            rowData={sites}
                        />
                    </ProCard.TabPane>
                    <ProCard.TabPane key="tab2" tab="Заявки">
                        <PanelRGrid
                            onCancelClick={disableAddingMode}
                            onShowAllItems={onShowAllItems(addingModes.issues)}
                            onAddToItems={onAddToItems(ledger.issues.list, 'заявкам', ISSUES.idProp)}
                            createItemProps={{ [role]: id }}
                            title={name}
                            resource={ISSUES}
                            rowData={issues}
                        />
                    </ProCard.TabPane>
                </ProCard>
            </BaseEditModal>
        </EditorContext.Provider>
    );
}

export default EditEmployeeModal;
