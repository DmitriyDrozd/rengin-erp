
import {useAllColumns} from '../../../grid/RCol'
import useLedger from '../../../hooks/useLedger'
import PanelRGrid from '../../../grid/PanelRGrid'
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