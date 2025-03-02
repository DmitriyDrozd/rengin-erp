import { ProCard } from '@ant-design/pro-components';
import { notification } from 'antd';
import {
    EMPLOYEES,
    ISSUES
} from 'iso/src/store/bootstrap';
import { employeeRoleEnum } from 'iso/src/store/bootstrap/repos/employees';
import SITES from 'iso/src/store/bootstrap/repos/sites';
import React, { useState } from 'react';
import { employeesditor } from '../../../editors/employeesEditor';
import PanelRGrid from '../../../grid/PanelRGrid';
import useLedger from '../../../hooks/useLedger';
import {
    EditorContext,
    useEditor
} from '../chapter-modal/useEditor';
import BaseEditModal from '../BaseItemModal';
import GenericRenFields from '../../form/GenericRenFields';
import { chunkHandler } from '../../../utils/chunkUtils';

const roleMap = {
    [employeeRoleEnum['техник']]: 'techUserId',
    [employeeRoleEnum['ответственный инженер']]: 'clientsEngineerUserId',
};

const rolesIssues = ISSUES.rolesProps;
const rolesSites = SITES.rolesProps;

const EditEmployeeModal = ({roles, id}: { roles: string[], id: string }) => {
    const ledger = useLedger();
    const useEditorData = useEditor(employeesditor, id);
    const isEditMode = useEditorData.mode === 'edit';
    const {removed, employeeId, clientsEmployeeNumber, ...propsToRender} = EMPLOYEES.properties;
    const list = [clientsEmployeeNumber, ...Array.from(Object.values(propsToRender))].filter(i => !!i);

    const [addingModes, setAddingModes] = useState({
        issues: false,
        sites: false,
    });
    const switchMode = (mode: string, value: boolean) => setAddingModes({
        ...addingModes,
        [mode]: value,
    });

    const onShowAllItems = (mode: string) => () => switchMode(mode, true);
    const disableAddingMode = (mode: string) => () => switchMode(mode, false);

    const resource = EMPLOYEES;
    const name = resource.getItemName(useEditorData.item);
    const role = roleMap[useEditorData.item.role];

    const showSites = isEditMode && rolesSites.includes(role);
    const showIssues = isEditMode && rolesIssues.includes(role);

    // @ts-ignore
    const sites = showSites ? ledger.sites.list.filter(s => addingModes.sites ? s[role] !== id : s[role] === id) : [];
    // @ts-ignore
    const issues = showIssues ? ledger.issues.list.filter(s => addingModes.issues ? s[role] !== id : s[role] === id) : [];

    const onAddToItems = (list: any[], name: string, idProp: string) => (selectedIds: string[], updateCollection: (updated: any[]) => void) => {
        const updated = list
            .filter(s => selectedIds.includes(s[idProp]))
            .map(s => ({
                ...s,
                [role]: id,
            }));

        chunkHandler(updated, updateCollection);

        notification.open({
            message: `${useEditorData.item.role} добавлен к ${updated.length} ${name}`,
            type: 'success'
        });
    };

    const onRemoveFromItems = (list: any[], name: string, idProp: string) => (selectedIds: string[], updateCollection: (updated: any[]) => void) => {
        const updated = list
            .filter(s => selectedIds.includes(s[idProp]))
            .map(s => ({
                ...s,
                [role]: undefined,
            }));

        chunkHandler(updated, updateCollection);

        notification.open({
            message: `${useEditorData.item.role} удалён из ${updated.length} ${name}`,
            type: 'success'
        });
    };

    return (
        <EditorContext.Provider value={useEditorData}>
            <BaseEditModal>
                <GenericRenFields list={list}/>
                <ProCard tabs={{type: 'card', cardProps: { bodyStyle: { padding: 0 }} }}>
                    {
                        showSites && (
                            <ProCard.TabPane key="tab1" tab="Объекты">
                                <PanelRGrid
                                    onCancelClick={disableAddingMode('sites')}
                                    onShowAllItems={onShowAllItems('sites')}
                                    onAddToItems={onAddToItems(ledger.sites.list, 'объектам', SITES.idProp)}
                                    onRemoveFromItems={onRemoveFromItems(ledger.sites.list, 'объектов', SITES.idProp)}
                                    createItemProps={{[role]: id}}
                                    title={name}
                                    name={name + '_employee_sites'}
                                    resource={SITES}
                                    rowData={sites}
                                />
                            </ProCard.TabPane>
                        )
                    }
                    {
                        showIssues && (
                            <ProCard.TabPane key="tab2" tab="Заявки">
                                <PanelRGrid
                                    onCancelClick={disableAddingMode('issues')}
                                    onShowAllItems={onShowAllItems('issues')}
                                    onAddToItems={onAddToItems(ledger.issues.list, 'заявкам', ISSUES.idProp)}
                                    onRemoveFromItems={onRemoveFromItems(ledger.issues.list, 'заявок', ISSUES.idProp)}
                                    createItemProps={{[role]: id}}
                                    title={name}
                                    name={name + '_employee_issues'}
                                    resource={ISSUES}
                                    rowData={issues}
                                />
                            </ProCard.TabPane>
                        )
                    }
                </ProCard>
            </BaseEditModal>
        </EditorContext.Provider>
    );
};

export default EditEmployeeModal;
