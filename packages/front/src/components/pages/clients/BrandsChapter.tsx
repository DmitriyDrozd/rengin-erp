import {RESOURCES_MAP} from 'iso/src/store/bootstrap/resourcesList'
import ItemChapter, {proProp} from '../chapter-routed/ItemChapter'
import {ProFormText} from '@ant-design/pro-components'
import BRANDS from 'iso/src/store/bootstrap/repos/brands'
import RGrid from '../../../grid/RGrid'
import useFrontSelector from '../../../hooks/common/useFrontSelector'
import {useAllColumns} from '../../../grid/RCol'

export default () => {
    const list = useFrontSelector(BRANDS.selectList) as any as typeof BRANDS.exampleItem

    const cols = useAllColumns(BRANDS)



    return <ItemChapter
        resource={RESOURCES_MAP.BRANDS}

        renderForm={({item, form,id,verb, resource}) =>
            <>
                <ProFormText {...proProp(BRANDS, 'brandName')} rules={[{required:true}]} />
                <ProFormText {...proProp(BRANDS, 'email')}/>
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