import {RESOURCES_MAP} from 'iso/src/store/bootstrap/resourcesList'
import ItemChapter, {fieldMetaToProProps} from '../chapter-routed/ItemChapter'
import {ProFormSelect, ProFormText} from '@ant-design/pro-components'
import BRANDS from 'iso/src/store/bootstrap/repos/brands'
import RGrid from '../../../grid/RGrid'
import useFrontSelector from '../../../hooks/common/useFrontSelector'
import {useAllColumns} from '../../../grid/RCol'
import LEGALS from 'iso/src/store/bootstrap/repos/legals'
import {SelectProps} from 'antd'
import useLedger from '../../../hooks/useLedger'
import {RCellRender} from '../../../grid/RCellRender'
import PanelRGrid from '../../../grid/PanelRGrid'

export default () => {
    const ledger = useLedger()
    const list = ledger.legals
    const [cols] = useAllColumns(LEGALS)



    return <ItemChapter
        resource={RESOURCES_MAP.LEGALS}

        renderForm={({item, form,id,verb, resource}) =>
            <>
                <ProFormSelect {...fieldMetaToProProps(LEGALS, 'brandId', item)} rules={[{required:true}]} />
                <ProFormText {...fieldMetaToProProps(LEGALS, 'legalName', item)} rules={[{required:true}]} />
                <ProFormText {...fieldMetaToProProps(LEGALS, 'region',item)} rules={[{required:true}]} />
            </>
        }
        renderList={({form,verb,resource}) => {
            return  <PanelRGrid
                title={'Все Юр. Лица'}
                resource={LEGALS}
                columnDefs={cols}
                rowData={list}
            />
        }}
    />
}