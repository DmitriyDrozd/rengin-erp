import ItemChapter, {fieldMetaToProProps} from '../chapter-routed/ItemChapter'
import {ProFormSelect, ProFormText, ProFormTextArea} from '@ant-design/pro-components'
import {useAllColumns} from '../../../grid/RCol'
import {useSelector} from 'react-redux'
import PanelRGrid from '../../../grid/PanelRGrid'
import useDigest from "../../../hooks/useDigest";
import {LEGALS, SITES} from "iso";

export default () => {
    const digest = useDigest()
    const entity = SITES
    const list = digest.sites//(SITES.selectors.selectAll) as any as typeof LEGALS.exampleItem
    const [cols] = useAllColumns(SITES)


    return <ItemChapter
                entity={entity}
                renderForm={({item, id,verb, entity}) => {
                    const legalValueEnum = useSelector(LEGALS.selectValueEnumByBrandId(item.brandId))
                    return <>
                        <ProFormSelect  {...fieldMetaToProProps(entity, 'brandId')} rules={[{required: true}]}/>
                        <ProFormSelect  {...fieldMetaToProProps(entity, 'legalId')} valueEnum={legalValueEnum}
                                        rules={[{required: true}]}/>
                        <ProFormText {...fieldMetaToProProps(entity, 'city')} rules={[{required: true}]}/>
                        <ProFormText {...fieldMetaToProProps(entity, 'address')} rules={[{required: true}]}/>
                        <ProFormText {...fieldMetaToProProps(entity, 'KPP')}/>
                        <ProFormText {...fieldMetaToProProps(entity, 'clientsEngineerUserId')}/>
                        <ProFormText {...fieldMetaToProProps(entity, 'managerUserId')}/>
                        <ProFormText {...fieldMetaToProProps(entity, 'techUserId')}/>
                        <ProFormTextArea {...fieldMetaToProProps(entity, 'contactInfo')}/>
                    </>
                }
        }
        renderList={({form,verb,entity}) => {
            const list = digest.sites//(SITES.selectors.selectAll) as any as typeof LEGALS.exampleItem
            const [cols] = useAllColumns(SITES)
            return         <PanelRGrid
                entity={SITES}
                fullHeight={true}
                title={'Все объекты'}
            />
        }}
    />
}