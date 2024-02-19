import {BRANDS, BrandVO} from 'iso'
import {useAllColumns} from '../../../grid/RCol'
import useDigest from "../../../hooks/useDigest";
import {ValueGetterFunc} from 'ag-grid-community/dist/lib/entities/colDef'

import PanelRGrid from '../../../grid/PanelRGrid'
import {useNavigate} from "react-router";
import React from "react";
import AppLayout from "../../../app/layout/AppLayout";

import {getNav} from "../../getNav";
import BrandModal from "./BrandModal";

export default () => {
    const digest = useDigest()
    const list = digest.brands
    const [cols] = useAllColumns(BRANDS)

    const currentItemId = window.location.hash === '' ? undefined : window.location.hash.slice(1)
    const navigate = useNavigate()

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
                entity={BRANDS}
                rowData={list}
                onCreateClick={onCreateClick}
                cols={[...cols,
                    {
                        colId:'sitesCalc',
                        field: 'brandId',
                        headerName:'Объекты',
                        editable: false,
                        valueGetter: (params => digest.sites.filter(s => s.brandId ===params.data.brandId).length) as ValueGetterFunc<BrandVO, string>
                    },
                    {
                        colId:'legalsCals',
                        field: 'brandId',
                        headerName:'Юр. лица',
                        editable: false,
                        valueGetter: (params => digest.legals.filter(s => s.brandId ===params.data.brandId).length) as ValueGetterFunc<BrandVO, string>
                    },
                    {
                        colId:'issuesCalc',
                        field: 'brandId',
                        headerName:'Всего заявок',
                        editable: false,
                        valueGetter: (params => digest.issues.filter(s => s.brandId ===params.data.brandId).length) as ValueGetterFunc<BrandVO, string>
                    },]}

            />
        </div>
    </AppLayout>
}