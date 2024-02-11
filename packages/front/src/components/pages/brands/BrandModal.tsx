import React from "react"
import {EditorContext, useEditor} from "../chapter-modal/useEditor"
import BaseEditModal from "../BaseItemModal"
import GenericRenAttrs from "../../form/GenericRenAttrs"
import {useAllColumns} from "../../../grid/RCol";
import {ProCard} from "@ant-design/pro-components";
import {AntdIcons} from "../../elements/AntdIcons";
import PanelRGrid from "../../../grid/PanelRGrid";
import {BRANDS, CONTRACTS, LEGALS, SITES} from "iso";
import useDigest from "../../../hooks/useDigest";
import {brandEditor} from "../../../editors/brandsEditor"

export default ({id}: {id: string}) => {
    const useEditorData = useEditor(brandEditor,id)
    const resource = BRANDS
    const {removed, ...propsToRender} = BRANDS.attributes
    const digest = useDigest()
    const sites = digest.sites.list.filter(s => s.brandId == id)
    const [sitesCols] = useAllColumns(SITES)
    const name = resource.getItemName(useEditorData.item)
    const legals = digest.legals.list.filter(s => s.brandId== id)
    const [legalsCols] = useAllColumns(LEGALS)
    const contracts = digest.contracts.list.filter(c => c.brandId === id)
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
            <GenericRenAttrs list={Array.from(Object.values(propsToRender))}/>
            {addon}
        </BaseEditModal>
    </EditorContext.Provider>
}