import {RESOURCES_MAP} from 'iso/src/store/bootstrap/resourcesList'
import ItemChapter, {fieldMetaToProProps} from '../chapter-routed/ItemChapter'
import {ProCard, ProFormText} from '@ant-design/pro-components'
import BRANDS, {BrandVO} from 'iso/src/store/bootstrap/repos/brands'
import {useAllColumns} from '../../../grid/RCol'
import useLedger from "../../../hooks/useLedger";
import SITES from 'iso/src/store/bootstrap/repos/sites'
import {useMount} from 'react-use'
import * as XLSX from 'xlsx'
import {ValueGetterFunc} from 'ag-grid-community/dist/lib/entities/colDef'
import LEGALS from 'iso/src/store/bootstrap/repos/legals'
import {AntdIcons} from '../../elements/AntdIcons'
import PanelRGrid from '../../../grid/PanelRGrid'
import CONTRACTS from 'iso/src/store/bootstrap/repos/contracts'

export default () => {
    const ledger = useLedger()
    const list = ledger.brands

    const [colsList, map] = useAllColumns(BRANDS)
const brandCols = [
    map.clickToEditCol,
    {
        ...map.brandName,
    },
    {
        colId:'sitesCalc',
        field: 'brandId',
        headerName:'Объекты',
        editable: false,
        valueGetter: (params => ledger.sites.filter(s => s.brandId ===params.data.brandId).length) as ValueGetterFunc<BrandVO, string>
    },
    {
        colId:'legalsCals',
        field: 'brandId',
        headerName:'Юр. лица',
        editable: false,
        valueGetter: (params => ledger.legals.filter(s => s.brandId ===params.data.brandId).length) as ValueGetterFunc<BrandVO, string>
    },
    {
        colId:'issuesCalc',
        field: 'brandId',
        headerName:'Всего заявок',
        editable: false,
        valueGetter: (params => ledger.issues.filter(s => s.brandId ===params.data.brandId).length) as ValueGetterFunc<BrandVO, string>
    },
]
    return <ItemChapter
            resource={RESOURCES_MAP.BRANDS}
            renderForm={({item, form,id,verb, resource}) =>
                <>
                    <ProFormText {...fieldMetaToProProps(BRANDS, 'brandName')} rules={[{required:true}]} />
                    <ProFormText {...fieldMetaToProProps(BRANDS, 'email')}/>
                </>
            }
            renderItemInfo={({verb,item,id, resource,form,}) => {
                const ledger = useLedger()
                const sites = ledger.sites.filter(s => s.brandId == id)
                const [sitesCols] = useAllColumns(SITES)
                const name = resource.getItemName(item)
                const legals = ledger.legals.filter(s => s.brandId== id)
                const [legalsCols] = useAllColumns(LEGALS)
                const contracts = ledger.contracts.filter(c => c.brandId === id)
                return  <ProCard
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
            }}



            renderList={({form,verb,resource}) => {
                useMount(() => {
                    const onPaste=function(e) {
                        /* get HTML */
                        /* this demo will read 3 different clipboard data types */

                        /* get clipboard data for each type */
                        var str =e.clipboardData.getData('text/html');
                        /* parse each data string into a workbook */
                        var wb = XLSX.read(str, {type: "string"})
                        /* get first worksheet from each workbook */
                        var ws_arr = wb.Sheets[wb.SheetNames[0]]
                        /* generate CSV for each "first worksheet" */
                        var result = XLSX.utils.sheet_to_json(ws_arr)
                        debugger///wsHING WITH wb HERE */
                    };
                    document.addEventListener('paste', onPaste)
                    return () => document.removeEventListener('paste', onPaste)
                })
                return  <PanelRGrid
                    fullHeight={true}
                            title={'Заказчики'}
                            resource={resource}
                            columnDefs={brandCols}
                            rowData={list}
                        />
            }}
    />
}