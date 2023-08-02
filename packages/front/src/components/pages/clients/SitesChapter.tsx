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
import SITES from 'iso/src/store/bootstrap/repos/sites'

export default () => {
    const ledger = useLedger()
    const RES = SITES
    const list = useFrontSelector(SITES.selectList) as any as typeof LEGALS.exampleItem

    const cols = useAllColumns(SITES)



    return <ItemChapter
        resource={RES}
        renderForm={({item, form,id,verb, resource}) =>
            <>
                <ProFormSelect.SearchSelect  {...proProp(RES, 'legalId')}  rules={[{required:true}]} />
                <ProFormText {...proProp(RES, 'city')} rules={[{required:true}]} />
                <ProFormText {...proProp(RES, 'address')} rules={[{required:true}]} />
                <ProFormText {...proProp(RES, 'KPP')}/>

                <ProFormSelect.SearchSelect  {...proProp(RES, 'contractId')}/>

                <ProFormText {...proProp(RES, 'responsibleEngineer')}/>
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