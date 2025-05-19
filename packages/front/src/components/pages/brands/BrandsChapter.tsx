import { ColDef } from 'ag-grid-community';
import BRANDS, { BrandVO } from 'iso/src/store/bootstrap/repos/brands.js';
import { useAllColumns } from '../../../grid/RCol.js';
import useLedger from '../../../hooks/useLedger.js';
import { ValueGetterFunc } from 'ag-grid-community/dist/lib/entities/colDef';
import PanelRGrid from '../../../grid/PanelRGrid';
import React from 'react';
import AppLayout from '../../app/AppLayout';

import BrandModal from './BrandModal';

export default () => {
    const ledger = useLedger();
    const list = ledger.brands;
    const [cols, colMap] = useAllColumns(BRANDS);

    const columns: ColDef<BrandVO>[] = [
        {...colMap.clickToEditCol, headerName: 'id'},
        {...colMap.clientsNumberCol},
        {...colMap.brandName, width: 150},
        {...colMap.brandType, width: 100},
        {...colMap.person, width: 100},
        {...colMap.email, width: 100},
        {...colMap.phone, width: 100},
        {...colMap.address, width: 250},
        {...colMap.web, width: 100},
        {...colMap.managerUserId, width: 120},
        {...colMap.desiredResolutionTerm, width: 100},
        {
            colId: 'sitesCalc',
            headerName: 'Объекты',
            editable: false,
            width: 150,
            valueGetter: (params => ledger.sites.list.filter(s => s.brandId === params.data.brandId).length) as ValueGetterFunc<BrandVO, string>
        },
        {
            colId: 'legalsCals',
            headerName: 'Юр. лица',
            editable: false,
            width: 120,
            valueGetter: (params => ledger.legals.list.filter(s => s.brandId === params.data.brandId).length) as ValueGetterFunc<BrandVO, string>
        },
        {
            colId: 'issuesCalc',
            headerName: 'Всего заявок',
            editable: false,
            width: 150,
            valueGetter: (params => ledger.issues.list.filter(s => s.brandId === params.data.brandId).length) as ValueGetterFunc<BrandVO, string>
        }
    ];

    const currentItemId = window.location.hash === '' ? undefined : window.location.hash.slice(1);

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
                columnDefs={columns}
                resource={BRANDS}
                rowData={list.list}
            />
        </div>
    </AppLayout>;
}