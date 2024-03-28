import { ProCard } from '@ant-design/pro-components';
import {
    EMPLOYEES,
    ISSUES
} from 'iso/src/store/bootstrap';
import BRANDS from 'iso/src/store/bootstrap/repos/brands';
import CONTRACTS from 'iso/src/store/bootstrap/repos/contracts';
import LEGALS from 'iso/src/store/bootstrap/repos/legals';
import SITES from 'iso/src/store/bootstrap/repos/sites';
import React from 'react';
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

    const resource = EMPLOYEES;
    const name = resource.getItemName(useEditorData.item);
    const sites = ledger.sites.list.filter(s => s.techUserId === id || s.clientsEngineerUserId === id)
    const issues = ledger.issues.list.filter(s => s.techUserId === id)

    const addon=  <ProCard
        tabs={{ type: 'card' }}
    >
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
                createItemProps={{ techUserId:id }}
                title={name}
                resource={ISSUES}
                rowData={issues}
            />
        </ProCard.TabPane>
    </ProCard>


    return (
        <EditorContext.Provider value={useEditorData}>
            <BaseEditModal>
                <GenericRenFields list={list} customOptions={customOptions}/>
                {addon}
            </BaseEditModal>
        </EditorContext.Provider>
    );
}

export default EditEmployeeModal;
