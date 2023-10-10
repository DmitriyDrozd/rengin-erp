import ItemChapter, {fieldMetaToProProps} from '../chapter-routed/ItemChapter'
import {ProFormSelect, ProFormText, ProFormTextArea} from '@ant-design/pro-components'
import {useAllColumns} from '../../../grid/RCol'
import LEGALS from 'iso/src/store/bootstrap/repos/legals'
import useLedger from '../../../hooks/useLedger'
import SITES from 'iso/src/store/bootstrap/repos/sites'
import {useSelector} from 'react-redux'
import PanelRGrid from '../../../grid/PanelRGrid'

export default () => {
    const ledger = useLedger()
    const RES = SITES
    const list = ledger.sites//(SITES.selectList) as any as typeof LEGALS.exampleItem
    const [cols] = useAllColumns(SITES)


    return <ItemChapter
                resource={RES}
                renderForm={({item, form,id,verb, resource}) => {
                    const legalValueEnum = useSelector(LEGALS.selectValueEnumByBrandId(item.brandId))
                    return <>
                        <ProFormSelect  {...fieldMetaToProProps(RES, 'brandId')} rules={[{required: true}]}/>
                        <ProFormSelect  {...fieldMetaToProProps(RES, 'legalId')} valueEnum={legalValueEnum}
                                        rules={[{required: true}]}/>
                        <ProFormText {...fieldMetaToProProps(RES, 'city')} rules={[{required: true}]}/>
                        <ProFormText {...fieldMetaToProProps(RES, 'address')} rules={[{required: true}]}/>
                        <ProFormText {...fieldMetaToProProps(RES, 'KPP')}/>

                        <ProFormText {...fieldMetaToProProps(RES, 'responsibleEngineer')}/>
                        <ProFormTextArea {...fieldMetaToProProps(RES, 'contactInfo')}/>
                        <ProFormSelect
                            {...fieldMetaToProProps(RES, '')}
                            valueEnum={legalValueEnum}
                            rules={[{required: true}]}
                        />
                    </>
                }
        }
        renderList={({form,verb,resource}) => {
            const list = ledger.sites//(SITES.selectList) as any as typeof LEGALS.exampleItem
            const [cols] = useAllColumns(SITES)
            return         <PanelRGrid
                resource={SITES}
                fullHeight={true}
                title={'Все объекты'}
            />
        }}
    />
}