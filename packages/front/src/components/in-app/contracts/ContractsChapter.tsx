import ItemChapter, {fieldMetaToProProps} from '../chapter-routed/ItemChapter'
import {ProForm, ProFormDatePicker, ProFormMoney, ProFormSelect, ProFormText} from '@ant-design/pro-components'
import {useAllColumns} from '../../../grid/RCol'
import {Row, Space} from 'antd'
import {useSelector} from 'react-redux'
import PanelRGrid from '../../../grid/PanelRGrid'
import {CONTRACTS, ENTITIES_MAP, LEGALS, SITES, SUBS,} from "iso";
import useDigest from "../../../hooks/useDigest";

export default () => {
    const digest = useDigest()
    const list = digest.contracts
    const [cols,map] = useAllColumns(CONTRACTS)

    return <ItemChapter
                entity={ENTITIES_MAP.CONTRACTS}
                renderForm={({item,id,verb, entity}) => {
                    console.log("brandId",item)
                    const legalValueEnum = useSelector(LEGALS.selectValueEnumByBrandId(item.brandId))
                    return      <>
                        <ProFormText {...fieldMetaToProProps(CONTRACTS, 'contractNumber', item)} rules={[{required: true}]}/>
                            <ProForm.Item label={'Заказчик'} required={true}  >
                                <Row>
                                    <ProFormSelect {...fieldMetaToProProps(CONTRACTS, 'brandId', item)} label={null} width={'sm'} rules={[{required: true}]}/>
                                    <ProFormSelect {...fieldMetaToProProps(CONTRACTS, 'legalId', item)} label={null}  width={'md'}   valueEnum={legalValueEnum} rules={[{required: true}]}/>
                                </Row>
                            </ProForm.Item>
                            <ProForm.Item label={'Дата подписания'}  >
                                <Row>
                                    <Space>
                                        <ProFormDatePicker {...fieldMetaToProProps(CONTRACTS,'signDate', item)} label={null} width={'sm'} rules={[]}/>
                                        <ProFormMoney locale={'ru-RU'} {...fieldMetaToProProps(CONTRACTS,'rate', item)} label={'Ставка за объект'} width={'sm'} rules={[]}/>
                                    </Space>
                                </Row>
                            </ProForm.Item>
                        <ProFormDatePicker {...fieldMetaToProProps(CONTRACTS,'endDate', item)} label={'Действует до'} width={'sm'} rules={[]}/>
                    </>
                }
        }
        renderItemInfo={({verb,item,id, entity,}) => {
            const digest = useDigest()
            const subList = digest.subs.list.filter(s => s.contractId === item.contractId)
            const sites = digest.sites.list.filter(s => s.brandId == id)
            const [sitesCols] = useAllColumns(SITES)

            const legals = digest.legals.list.filter(s => s.brandId== id)
            const [legalsCols] = useAllColumns(LEGALS)
            return <PanelRGrid
                createItemProps={{contractId:id}}
                entity={SUBS}
                title={'Подключённые объекты'}
                rowData={subList}
            />
        }}
        renderList={({form,verb,entity}) => {
            return  <div>
                        <PanelRGrid

                            fullHeight={true}
                            entity={CONTRACTS}
                            title={'Все договоры'}
                            columnDefs={[map.clickToEditCol, ...cols]}
                        />
                        {/**<FooterToolbar extra="extra information">
                            <Button>Cancel</Button>
                            <Button type="primary">Submit</Button>
                        </FooterToolbar>*/}
                    </div>
        }}
    />
}