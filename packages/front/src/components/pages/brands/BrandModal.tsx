import React from 'react';
import {
    EditorContext,
    useEditor
} from '../chapter-modal/useEditor';
import BaseEditModal from '../BaseItemModal';
import GenericRenFields from '../../form/GenericRenFields';
import { brandEditor } from '../../../editors/brandsEditor';
import BRANDS from 'iso/src/store/bootstrap/repos/brands';
import useLedger from '../../../hooks/useLedger';
import SITES from 'iso/src/store/bootstrap/repos/sites';
import LEGALS from 'iso/src/store/bootstrap/repos/legals';
import { ProCard } from '@ant-design/pro-components';
import PanelRGrid from '../../../grid/PanelRGrid';
import CONTRACTS from 'iso/src/store/bootstrap/repos/contracts';

export default ({id}: { id: string }) => {
    const useEditorData = useEditor(brandEditor, id);
    const resource = BRANDS;
    const {removed, brandId, clientsBrandNumber, ...propsToRender} = BRANDS.properties;
    const ledger = useLedger();
    const sites = ledger.sites.list.filter(s => s.brandId == id);
    const name = resource.getItemName(useEditorData.item);
    const legals = ledger.legals.list.filter(s => s.brandId == id);
    const contracts = ledger.contracts.list.filter(c => c.brandId === id);
    const isEditMode = useEditorData.mode === 'edit';
    const addon = (
        <ProCard
            tabs={{
                type: 'card',
            }}
        >
            <ProCard.TabPane key="tab1" tab="Объекты"
            >
                <PanelRGrid
                    createItemProps={{brandId: id}}
                    title={name}
                    resource={SITES}
                    rowData={sites}
                />
            </ProCard.TabPane>
            <ProCard.TabPane key="tab2" tab="Юр. Лица">
                <PanelRGrid
                    createItemProps={{brandId: id}}
                    title={name}
                    resource={LEGALS}
                    rowData={legals}
                />
            </ProCard.TabPane>
            <ProCard.TabPane key="tab3" tab="Договоры">
                <PanelRGrid
                    createItemProps={{brandId: id}}
                    title={name}
                    resource={CONTRACTS}
                    rowData={contracts}
                />
            </ProCard.TabPane>

        </ProCard>
    );

    const list = [...Array.from(Object.values(propsToRender)), isEditMode ? clientsBrandNumber : undefined].filter(i => !!i);

    return (
        <EditorContext.Provider value={useEditorData}>
            <BaseEditModal title={!isEditMode && 'Новый заказчик'}>
                <GenericRenFields list={list}/>
                {addon}
            </BaseEditModal>
        </EditorContext.Provider>
    );
}