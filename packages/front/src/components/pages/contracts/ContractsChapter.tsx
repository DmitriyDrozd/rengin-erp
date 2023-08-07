import {RESOURCES_MAP} from 'iso/src/store/bootstrap/resourcesList'
import ItemChapter, {fieldMetaToProProps} from '../chapter-routed/ItemChapter'
import {
    ProField,
    ProForm,
    ProFormDatePicker,
    ProFormMoney,
    ProFormSelect,
    ProFormText
} from '@ant-design/pro-components'
import BRANDS from 'iso/src/store/bootstrap/repos/brands'
import RGrid from '../../../grid/RGrid'
import useFrontSelector from '../../../hooks/common/useFrontSelector'
import {useAllColumns} from '../../../grid/RCol'
import LEGALS from 'iso/src/store/bootstrap/repos/legals'
import {Row, SelectProps, Space} from 'antd'
import useLedger from '../../../hooks/useLedger'
import {RCellRender} from '../../../grid/RCellRender'
import CONTRACTS from 'iso/src/store/bootstrap/repos/contracts'
import {useSelector} from 'react-redux'

export default () => {
    const ledger = useLedger()
    const list = ledger.contracts
    const [cols] = useAllColumns(CONTRACTS)



    return <ItemChapter
                resource={RESOURCES_MAP.CONTRACTS}
                renderForm={({item,id,verb, resource}) => {
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
                renderItemInfo={({item,renderItemInfo,renderForm,renderList,id,resource,verb})=>{

                }}
        renderList={({form,verb,resource}) => {
            return  <RGrid
                columnDefs={cols}
                rowData={list}
            />
        }}
    />
}