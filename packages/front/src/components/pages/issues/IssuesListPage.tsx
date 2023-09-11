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
import {useAllColumns} from '../../../grid/RCol'
import LEGALS from 'iso/src/store/bootstrap/repos/legals'
import {Button, Input, Row, SelectProps, Space} from 'antd'
import useLedger from '../../../hooks/useLedger'
import {RCellRender} from '../../../grid/RCellRender'
import CONTRACTS from 'iso/src/store/bootstrap/repos/contracts'
import {useSelector} from 'react-redux'
import PanelRGrid from '../../../grid/PanelRGrid'
import SUBS from 'iso/src/store/bootstrap/repos/subs'
import SITES, {SiteVO} from 'iso/src/store/bootstrap/repos/sites'
import {ISSUES} from 'iso/src/store/bootstrap/repos/issues'
import AppLayout from '../../app/AppLayout'
import React from 'react'
export default () => {
    const ledger = useLedger()

    const onCreateClick = (defaults) => {
        console.log(defaults)
    }
    const [cols,map] = useAllColumns(ISSUES)

            return  <AppLayout
                hidePageContainer={true}
                proLayout={{contentStyle:{
                        padding: '0px'
                    }
                }}
            >
                <div>



                    <PanelRGrid
                        onCreateClick={onCreateClick}
                        fullHeight={true}
                        resource={ISSUES}
                        title={'Все заявки'}
                    />
                    {
                        /**
                         <FooterToolbar extra="extra information">
                     <Button>Cancel</Button>
                     <Button type="primary">Submit</Button>
                     </FooterToolbar>
                         */
                    }</div>

            </AppLayout>

}