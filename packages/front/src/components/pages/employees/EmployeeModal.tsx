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

const EditEmployeeModal = ({ roles, id }: { roles: string[], id: string }) => {
    const ledger = useLedger()
    const useEditorData = useEditor(employeesditor, id);
    const {removed, clientsEmployeeNumber, ...propsToRender} = EMPLOYEES.properties;
    const list = Array.from(Object.values(propsToRender));
    const customOptions = roles.map(r => ({ value: r, label: r }));

    const [isAddingMode, setIsAddingMode] = useState(false);
    const onShowAllItems = () =>  setIsAddingMode(true);
    const disableAddingMode = () => setIsAddingMode(false);

    const resource= EMPLOYEES;
    const name = resource.getItemName(useEditorData.item);
    const role = useEditorData.item.role === employeeRoleEnum.техник
        ? 'techUserId' : 'clientsEngineerUserId';
    const sites = ledger.sites.list.filter(s => s.techUserId === id || s.clientsEngineerUserId === id)
    const issues = ledger.issues.list.filter(s => isAddingMode ? s[role] !== id : s[role] === id);

    const onAddToItems = (selectedIds: string[], updateCollection: (updated: any[]) => void) => {
        const updated = ledger.issues.list
            .filter(s => selectedIds.includes(s.issueId))
            .map(s => ({
                ...s,
                [role]: id,
            }));

        updateCollection(updated);
        notification.open({
            message: useEditorData.item.role + ' добавлен к заявкам',
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
                            createItemProps={{ techUserId:id, clientsEngineerUserId: id }}
                            title={name}
                            resource={SITES}
                            rowData={sites}
                        />
                    </ProCard.TabPane>
                    <ProCard.TabPane key="tab2" tab="Заявки">
                        <PanelRGrid
                            onCancelClick={disableAddingMode}
                            onShowAllItems={onShowAllItems}
                            onAddToItems={onAddToItems}
                            createItemProps={{ techUserId:id }}
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
