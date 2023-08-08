import {RESOURCES_MAP} from 'iso/src/store/bootstrap/resourcesList'
import ItemChapter, {fieldMetaToProProps} from '../chapter-routed/ItemChapter'
import {
    ProField,
    ProForm,
    ProFormDatePicker,
    ProFormMoney,
    ProFormSelect,
    ProFormText, ProTable
} from '@ant-design/pro-components'
import BRANDS from 'iso/src/store/bootstrap/repos/brands'
import RGrid from '../../../grid/RGrid'
import useFrontSelector from '../../../hooks/common/useFrontSelector'
import {useAllColumns} from '../../../grid/RCol'
import LEGALS from 'iso/src/store/bootstrap/repos/legals'
import {Button, Input, Row, SelectProps, Space} from 'antd'
import useLedger from '../../../hooks/useLedger'
import {RCellRender} from '../../../grid/RCellRender'
import CONTRACTS from 'iso/src/store/bootstrap/repos/contracts'
import {useSelector} from 'react-redux'
import PageHeader from 'ant-design-pro/lib/PageHeader'
import FooterToolbar from 'ant-design-pro/lib/FooterToolbar'
import HeaderSearch from 'ant-design-pro/lib/HeaderSearch'
import CrudCreateButton from '../../elements/CreateButton'
import Search from 'antd/es/input/Search'
import {SearchOutlined} from '@ant-design/icons'
import PanelRGrid from '../../../grid/PanelRGrid'
import SUBS from 'iso/src/store/bootstrap/repos/subs'
export default () => {
    const ledger = useLedger()
    const list = ledger.contracts
    const [cols] = useAllColumns(SUBS)



    return <ItemChapter
        resource={RESOURCES_MAP.CONTRACTS}
        renderForm={({item,id,verb, resource}) => {
            const contractValueEnum = useSelector(CONTRACTS.selectValueEnumByLegalId(item.legalId))
            return <>
                <ProFormSelect {...fieldMetaToProProps(SUBS, 'contractId', item)} valueEnum={contractValueEnum} rules={[{required: true}]}/>
                <ProForm.Item label={'Период подключения'} required={true}  >
                    <Row>
                        <ProFormSelect {...fieldMetaToProProps(SUBS, 'subscribeDate', item)} label={null} width={'sm'} rules={[{required: true}]}/>
                        <ProFormSelect {...fieldMetaToProProps(SUBS, 'unsubscribeDate', item)} label={null}  width={'sm'} />
                    </Row>
                </ProForm.Item>
                <ProFormDatePicker {...fieldMetaToProProps(SUBS,'siteId', item)} label={'Действует до'} width={'sm'} rules={[]}/>
            </>
        }
        }
        renderItemInfo={({item,renderItemInfo,renderForm,renderList,id,resource,verb})=>{

        }}
        renderList={({form,verb,resource}) => {
            return  <div>



                <PanelRGrid
                    resource={SUBS}
                    title={'Все абонентские подключения'}

                />
                {/**<FooterToolbar extra="extra information">
                 <Button>Cancel</Button>
                 <Button type="primary">Submit</Button>
                 </FooterToolbar>*/}</div>
        }}
    />
}