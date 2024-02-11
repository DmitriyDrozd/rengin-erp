import ItemChapter, {fieldMetaToProProps} from '../chapter-routed/ItemChapter'
import {ProFormSelect, ProFormText} from '@ant-design/pro-components'
import {useAllColumns} from '../../../grid/RCol'
import useDigest from '../../../hooks/useDigest'
import PanelRGrid from '../../../grid/PanelRGrid'
import {ENTITIES_MAP, LEGALS} from "iso";

export default () => {
    const digest = useDigest()
    
    const list = digest.legals
    const [cols,colMap] = useAllColumns(LEGALS)



    const RES = LEGALS
    return <ItemChapter
        resource={ENTITIES_MAP.LEGALS}

        renderForm={({item,id,verb, resource}) =>
            <>
                <ProFormSelect {...fieldMetaToProProps(LEGALS, 'brandId', item)} rules={[{required:true}]} />
                <ProFormText {...fieldMetaToProProps(LEGALS, 'legalName', item)} rules={[{required:true}]} />
                <ProFormText {...fieldMetaToProProps(LEGALS, 'region',item)} rules={[{required:true}]} />

            </>
        }
        renderList={({form,verb,resource}) => {
            return  <PanelRGrid
                fullHeight={true}
                title={'Все Юр. Лица'}
                resource={LEGALS}

                rowData={list}
            />
        }}
    />
}