import {RESOURCES_MAP} from 'iso/src/store/bootstrap/resourcesList'
import ItemChapter, {proProp} from '../chapter-routed/ItemChapter'
import {ProFormSelect, ProFormText} from '@ant-design/pro-components'
import BRANDS from 'iso/src/store/bootstrap/repos/brands'
import RGrid from '../../../grid/RGrid'
import useFrontSelector from '../../../hooks/common/useFrontSelector'
import {useAllColumns} from '../../../grid/RCol'
import LEGALS from 'iso/src/store/bootstrap/repos/legals'
import {SelectProps} from 'antd'
import useLedger from '../../../hooks/useLedger'
import {RCellRender} from '../../../grid/RCellRender'

export default () => {
    const ledger = useLedger()
    const list = useFrontSelector(LEGALS.selectList) as any as typeof LEGALS.exampleItem

    const cols = useAllColumns(LEGALS)



    return <ItemChapter
        resource={RESOURCES_MAP.LEGALS}

        renderForm={({item, form,id,verb, resource}) =>
            <>

                <ProFormText {...proProp(LEGALS, 'legalName')} rules={[{required:true}]} />
                <ProFormText {...proProp(LEGALS, 'region')} rules={[{required:true}]} />
                <ProFormSelect.SearchSelect {...proProp(LEGALS, 'brandId')}


                               rules={[{required:true}]} />
            </>
        }
        renderList={({form,verb,resource}) => {
            return  <RGrid
                columnDefs={cols}
                rowData={list}
            />
        }}
    />
}