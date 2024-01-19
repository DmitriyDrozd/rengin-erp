import {RESOURCES_MAP} from 'iso/src/store/bootstrap/resourcesList.js'
import ItemChapter, {fieldMetaToProProps} from '../chapter-routed/ItemChapter.js'
import {ProCard, ProFormText} from '@ant-design/pro-components'
import BRANDS, {BrandVO} from 'iso/src/store/bootstrap/repos/brands.js'
import {useAllColumns} from '../../../grid/RCol.js'
import useLedger from "../../../hooks/useLedger.js";
import SITES from 'iso/src/store/bootstrap/repos/sites.js'
import {useMount} from 'react-use'
import * as XLSX from 'xlsx'
import {ValueGetterFunc} from 'ag-grid-community/dist/lib/entities/colDef'

import PanelRGrid from '../../../grid/PanelRGrid'
import {USERS} from "iso/src/store/bootstrap";
import {useHistory, useRouteMatch} from "react-router";
import React from "react";
import AppLayout from "../../app/AppLayout";

import {getNav} from "../../getNav";
import BrandModal from "./BrandModal";

export default () => {
    const ledger = useLedger()
    const list = ledger.brands
    const [cols] = useAllColumns(BRANDS)

    const currentItemId = window.location.hash === '' ? undefined : window.location.hash.slice(1)
    const history = useHistory()

    const onCreateClick = () => {
        history.push(getNav().brandsList({brandID: 'create'}))
    }


    return  <AppLayout
        hidePageContainer={true}
        proLayout={{contentStyle:{
                padding: '0px'
            }
        }}
    >
        <div>
            {
                currentItemId ? <BrandModal id={currentItemId} /> : null
            }

            <PanelRGrid
                fullHeight={true}
                title={BRANDS.langRU.plural}
                resource={BRANDS}
                rowData={list}
                onCreateClick={onCreateClick}
                cols={[...cols,
                    {
                        colId:'sitesCalc',
                        field: 'brandId',
                        headerName:'Объекты',
                        editable: false,
                        valueGetter: (params => ledger.sites.filter(s => s.brandId ===params.data.brandId).length) as ValueGetterFunc<BrandVO, string>
                    },
                    {
                        colId:'legalsCals',
                        field: 'brandId',
                        headerName:'Юр. лица',
                        editable: false,
                        valueGetter: (params => ledger.legals.filter(s => s.brandId ===params.data.brandId).length) as ValueGetterFunc<BrandVO, string>
                    },
                    {
                        colId:'issuesCalc',
                        field: 'brandId',
                        headerName:'Всего заявок',
                        editable: false,
                        valueGetter: (params => ledger.issues.filter(s => s.brandId ===params.data.brandId).length) as ValueGetterFunc<BrandVO, string>
                    },]}

            />
        </div>
    </AppLayout>
}