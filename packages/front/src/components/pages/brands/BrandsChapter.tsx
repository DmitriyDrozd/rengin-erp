import BRANDS, { BrandVO } from 'iso/src/store/bootstrap/repos/brands.js';
import { useAllColumns } from '../../../grid/RCol.js';
import useLedger from '../../../hooks/useLedger.js';
import { ValueGetterFunc } from 'ag-grid-community/dist/lib/entities/colDef';

import PanelRGrid from '../../../grid/PanelRGrid';
import {
    useHistory,
} from 'react-router';
import React from 'react';
import AppLayout from '../../app/AppLayout';

import { getNav } from '../../getNav';
import BrandModal from './BrandModal';

export default () => {
    const ledger = useLedger();
    const list = ledger.brands;
    const [cols] = useAllColumns(BRANDS);

    const currentItemId = window.location.hash === '' ? undefined : window.location.hash.slice(1);
    const history = useHistory();

    const onCreateClick = () => {
        history.push(getNav().brandsList({brandID: 'create'}));
    };


    return <AppLayout
        hidePageContainer={true}
        proLayout={{
            contentStyle: {
                padding: '0px'
            }
        }}
    >
        <div>
            {
                currentItemId ? <BrandModal id={currentItemId}/> : null
            }

            <PanelRGrid
                fullHeight={true}
                title={BRANDS.langRU.plural}
                resource={BRANDS}
                rowData={list.list}
                onCreateClick={onCreateClick}
                cols={[...cols,
                    {
                        colId: 'sitesCalc',
                        field: 'brandId',
                        headerName: 'Объекты',
                        editable: false,
                        valueGetter: (params => ledger.sites.list.filter(s => s.brandId === params.data.brandId).length) as ValueGetterFunc<BrandVO, string>
                    },
                    {
                        colId: 'legalsCals',
                        field: 'brandId',
                        headerName: 'Юр. лица',
                        editable: false,
                        valueGetter: (params => ledger.legals.list.filter(s => s.brandId === params.data.brandId).length) as ValueGetterFunc<BrandVO, string>
                    },
                    {
                        colId: 'issuesCalc',
                        field: 'brandId',
                        headerName: 'Всего заявок',
                        editable: false,
                        valueGetter: (params => ledger.issues.list.filter(s => s.brandId === params.data.brandId).length) as ValueGetterFunc<BrandVO, string>
                    },]}

            />
        </div>
    </AppLayout>;
}