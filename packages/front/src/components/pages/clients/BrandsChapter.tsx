import {RESOURCES_MAP} from 'iso/src/store/bootstrap/resourcesList'
import ItemChapter, {fieldMetaToProProps} from '../chapter-routed/ItemChapter'
import {ProCard, ProFormText} from '@ant-design/pro-components'
import BRANDS, {BrandVO} from 'iso/src/store/bootstrap/repos/brands'
import RGrid from '../../../grid/RGrid'
import useFrontSelector from '../../../hooks/common/useFrontSelector'
import {useAllColumns} from '../../../grid/RCol'
import useLedger from "../../../hooks/useLedger";
import SITES from 'iso/src/store/bootstrap/repos/sites'
import {useMount} from 'react-use'
import * as XLSX from 'xlsx'
import {ValueGetterFunc} from 'ag-grid-community/dist/lib/entities/colDef'
import {EditOutlined, EllipsisOutlined, SettingOutlined} from '@ant-design/icons'
import LEGALS from 'iso/src/store/bootstrap/repos/legals'
import CrudCreateButton from '../../elements/CrudCreateButton'
import {Button, Card, Space} from 'antd'
import {AntdIcons} from '../../elements/AntdIcons'
import {nav} from '../../nav'
export default () => {
    const ledger = useLedger()
    const list = ledger.brands

    const [colsList, map] = useAllColumns(BRANDS)
const brandCols = [
    {
        ...map.clickToEditCol
    },
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
                return  <ProCard
                            tabs={{
                                type: 'card',
                            }}
                            actions={[null,<AntdIcons.PlusSquareOutlined/>]}
                        >

                        <ProCard.TabPane key="tab1" tab="Объекты"
                        >
                            <Card extra={<Space><CrudCreateButton href={nav.sitesCreate({},{brandId: id})}/></Space>}
                                  title={'Объекты заказчика '+name}
                            >
                            <RGrid columnDefs={sitesCols} rowData={sites}/>
                            </Card>
                        </ProCard.TabPane>
                        <ProCard.TabPane key="tab2" tab="Юр. Лица">
                            <Card extra={<Space><CrudCreateButton href={nav.legalsCreate({},{brandId: id})}/></Space>}
                                  title={'Юр. лица заказчика '+name}
                            >
                                <RGrid columnDefs={legalsCols} rowData={legals}/>
                            </Card>

                        </ProCard.TabPane>
                    <ProCard.TabPane key="tab3" tab="Договоры">
                        <Card extra={<Space><CrudCreateButton href={nav.legalsCreate({},{brandId: id})}/></Space>}
                              title={'Договоры с заказчиком '+name}
                        >
                            <RGrid columnDefs={legalsCols} rowData={legals}/>
                        </Card>

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
                return  <RGrid
                            columnDefs={brandCols}
                            rowData={list}
                        />
            }}
    />
}