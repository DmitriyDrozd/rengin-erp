import {USERS} from "iso/src/store/bootstrap"
import React from "react"
import {EditorContext, useEditor} from "../chapter-modal/useEditor"
import BaseEditModal from "../BaseItemModal"
import GenericRenFields from "../../form/GenericRenFields"
import {brandEditor} from "../../../editors/brandsEditor"
import BRANDS from "iso/src/store/bootstrap/repos/brands";
import useLedger from "../../../hooks/useLedger";
import {useAllColumns} from "../../../grid/RCol";
import SITES from "iso/src/store/bootstrap/repos/sites";
import LEGALS from "iso/src/store/bootstrap/repos/legals";
import {ProCard} from "@ant-design/pro-components";
import {AntdIcons} from "../../elements/AntdIcons";
import PanelRGrid from "../../../grid/PanelRGrid";
import CONTRACTS from "iso/src/store/bootstrap/repos/contracts";

export default ({id}: {id: string}) => {
    const useEditorData = useEditor(brandEditor,id)
    const resource = BRANDS
    const {removed, ...propsToRender} = BRANDS.properties
    const ledger = useLedger()
    const sites = ledger.sites.filter(s => s.brandId == id)
    const [sitesCols] = useAllColumns(SITES)
    const name = resource.getItemName(useEditorData.item)
    const legals = ledger.legals.filter(s => s.brandId== id)
    const [legalsCols] = useAllColumns(LEGALS)
    const contracts = ledger.contracts.filter(c => c.brandId === id)
    const addon=  <ProCard
        tabs={{
            type: 'card',
        }}
        actions={[null,<AntdIcons.PlusSquareOutlined/>]}
    >

        <ProCard.TabPane key="tab1" tab="Объекты"
        >
            <PanelRGrid
                createItemProps={{ brandId:id }}
                title={name}
                resource={SITES}
                rowData={sites}
            />

        </ProCard.TabPane>
        <ProCard.TabPane key="tab2" tab="Юр. Лица">
            <PanelRGrid
                createItemProps={{ brandId:id }}
                title={name}
                resource={LEGALS}
                rowData={legals}
            />

        </ProCard.TabPane>
        <ProCard.TabPane key="tab3" tab="Договоры">
            <PanelRGrid
                createItemProps={{ brandId:id }}
                title={name}
                resource={CONTRACTS}
                rowData={contracts}
            />
        </ProCard.TabPane>

    </ProCard>
    return   <EditorContext.Provider value={useEditorData}>
        <BaseEditModal>
            <GenericRenFields list={Array.from(Object.values(propsToRender))}/>
            {addon}
        </BaseEditModal>
    </EditorContext.Provider>
}