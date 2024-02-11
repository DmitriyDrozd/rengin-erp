import ItemChapter, {fieldMetaToProProps} from '../chapter-routed/ItemChapter'
import {ProFormSelect, ProFormText, ProFormTextArea} from '@ant-design/pro-components'
import {useAllColumns} from '../../../grid/RCol'
import {useSelector} from 'react-redux'
import PanelRGrid from '../../../grid/PanelRGrid'
import useDigest from "../../../hooks/useDigest";
import {LEGALS, SITES} from "iso";

export default () => {
    const digest = useDigest()
    const RES = SITES
    const list = digest.sites//(SITES.selectors.selectAll) as any as typeof LEGALS.exampleItem
    const [cols] = useAllColumns(SITES)


    return <ItemChapter
                resource={RES}
                renderForm={({item, id,verb, resource}) => {
                    const legalValueEnum = useSelector(LEGALS.selectValueEnumByBrandId(item.brandId))
                    return <>
                        <ProFormSelect  {...fieldMetaToProProps(RES, 'brandId')} rules={[{required: true}]}/>
                        <ProFormSelect  {...fieldMetaToProProps(RES, 'legalId')} valueEnum={legalValueEnum}
                                        rules={[{required: true}]}/>
                        <ProFormText {...fieldMetaToProProps(RES, 'city')} rules={[{required: true}]}/>
                        <ProFormText {...fieldMetaToProProps(RES, 'address')} rules={[{required: true}]}/>
                        <ProFormText {...fieldMetaToProProps(RES, 'KPP')}/>
                        <ProFormText {...fieldMetaToProProps(RES, 'clientsEngineerUserId')}/>
                        <ProFormText {...fieldMetaToProProps(RES, 'managerUserId')}/>
                        <ProFormText {...fieldMetaToProProps(RES, 'techUserId')}/>
                        <ProFormTextArea {...fieldMetaToProProps(RES, 'contactInfo')}/>
                    </>
                }
        }
        renderList={({form,verb,resource}) => {
            const list = digest.sites//(SITES.selectors.selectAll) as any as typeof LEGALS.exampleItem
            const [cols] = useAllColumns(SITES)
            return         <PanelRGrid
                resource={SITES}
                fullHeight={true}
                title={'Все объекты'}
            />
        }}
    />
}