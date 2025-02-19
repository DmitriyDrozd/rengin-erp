import {
    Modal,
} from 'antd';
import {
    getItemNumberGenerator
} from '../../../utils/byQueryGetters';
import AppLayout from '../../app/AppLayout';
import React, { useState } from 'react';
import BRANDS from 'iso/src/store/bootstrap/repos/brands';
import LEGALS from 'iso/src/store/bootstrap/repos/legals';
import SITES, { SiteVO } from 'iso/src/store/bootstrap/repos/sites';
import { sleep } from '@sha/utils';
import { useStore } from 'react-redux';
import {
    call,
    put,
    select
} from 'typed-redux-saga';
import { selectLedger } from 'iso/src/store/bootstrapDuck';
import { generateGuid } from '@sha/random';
import ImportCard from '../../elements/ImportCard';
import { ProgressCircle } from '../../misc/ProgressCircle';
import {
    AVERAGE_CREATE_TIME,
    rejectFn
} from './helper';

export const importSitesXlsxCols = ['clientsSiteNumber', 'brandName', 'legalName', 'city', 'address'] as const;
type Datum = Record<typeof importSitesXlsxCols[number], string>

const importInterval = 1;
const CHUNK_SIZE = 1000;
/**
 * Mongo processes one record around 120ms
 */
const itemImportTime = 120;
const chunkImportInterval = itemImportTime * CHUNK_SIZE;

const getImportObjectsSaga = ({newSites, invalidSites, duplicatedSites}: { newSites: any[], invalidSites: any[], duplicatedSites: any[] }) => {
    const generateClientsBrandNumber = getItemNumberGenerator();
    const generateClientsLegalNumber = getItemNumberGenerator();
    const generateClientsSiteNumber = getItemNumberGenerator();

    return function* importObjectsSaga(data: Datum[]) {
        let ledger: ReturnType<typeof selectLedger> = yield* select(selectLedger);

        function* updateLedger() {
            ledger = yield* select(selectLedger);
        }

        function* getOrCreateSite({clientsSiteNumber, brandName, legalName, city, address}: {
            clientsSiteNumber: string,
            brandName: string,
            legalName: string,
            city: string,
            address: string
        }) {
            let brand = ledger.brands.byName[brandName];

            if (!brand) {
                const newBrand = {
                    brandId: generateGuid(),
                    brandName,
                    address: `${city}, ${address}`,
                    clientsBrandNumber: generateClientsBrandNumber(ledger.brands.list, 'clientsBrandNumber'),
                    brandType: 'Заказчик',
                    person: '',
                    email: '',
                    phone: '',
                    web: '',
                    managerUserId: '',
                    removed: false
                };

                const action = BRANDS.actions.added(newBrand);
                console.log(`Brand ${brandName} not found, create one`, action);
                yield* put(action);

                yield* call(updateLedger);
                yield* call(sleep, 50);

                brand = newBrand;
            } else {
                console.log(`Brand ${brandName} found`);
            }

            let legal = ledger.legals.list.find(l => l.brandId === brand.brandId && l.legalName === legalName);

            if (!legal) {
                const newLegal = {
                    brandId: brand.brandId,
                    legalId: generateGuid(),
                    legalName,
                    region: city,
                    clientsLegalNumber: generateClientsLegalNumber(ledger.legals.list, 'clientsLegalNumber'),
                };

                const action = LEGALS.actions.added(newLegal);
                console.log(`Legal ${legalName} not found, create one`, action);
                yield* put(action);

                yield* call(updateLedger);
                yield* call(sleep, 50);

                legal = newLegal;
            } else {
                console.log(`Legal ${legalName} found`);
            }

            let site = ledger.sites.list.find(s => s.brandId === brand.brandId && s.legalId === legal.legalId &&
                s.city === city && s.address === address);

            if (!site) {
                const newSite = {
                    brandId: brand.brandId,
                    legalId: legal.legalId,
                    city,
                    address,
                    siteId: generateGuid(),
                    clientsSiteNumber: clientsSiteNumber
                        ? String(clientsSiteNumber)
                        : generateClientsSiteNumber(ledger.sites.list, 'clientsSiteNumber'),
                };
                console.log(`Site not found, create one`, newSite.address);
                newSites.push(rejectFn(newSite));
            } else {
                duplicatedSites.push({clientsNumber: site.clientsSiteNumber || clientsSiteNumber});
            }
        }

        for (let i = 0; i < data.length; i++) {
            const d = data[i];
            yield* call(getOrCreateSite, {
                clientsSiteNumber: d.clientsSiteNumber,
                brandName: d.brandName,
                legalName: d.legalName,
                city: d.city,
                address: d.address
            });
            yield* call(sleep, importInterval);
        }

        console.log('putting ', newSites.length);
        if (newSites.length) {
            if (newSites.length > CHUNK_SIZE) {
                const chunkCount = Math.ceil(newSites.length / CHUNK_SIZE);
                const itemsInChunk = Math.ceil(newSites.length / chunkCount);

                for (let i = 0; i < chunkCount; i++) {
                    const chunk = newSites.slice(i * itemsInChunk, (i + 1) * itemsInChunk);
                    console.log('PUT');
                    yield* put(SITES.actions.addedBatch(chunk));
                    console.log('PUT - yielded');
                    yield* call(sleep, chunkImportInterval);
                }
            } else {
                yield* put(SITES.actions.addedBatch(newSites));
            }
        }
    };
};

let interval;

const getFullDuration = (dataLength: number) => {
    const ledgerDuration = dataLength * (AVERAGE_CREATE_TIME + importInterval);
    const creationDuration = dataLength > CHUNK_SIZE ? (Math.ceil(dataLength / CHUNK_SIZE) * chunkImportInterval) : dataLength * itemImportTime;
    return ledgerDuration + creationDuration;
}

export default () => {
    const store = useStore();
    const [percent, setPercent] = useState(0);
    const [fullDuration, setFullDuration] = useState(0);

    const startProgress = (dataLength: number) => {
        let _percent = percent || 0;

        const fullDuration = getFullDuration(dataLength);
        const progressInterval = fullDuration / 100;

        if (fullDuration > 1000) {
            setPercent(1);
            interval = setInterval(() => {
                _percent += 1;
                setPercent(_percent);
            }, progressInterval);

            setFullDuration(fullDuration);
        }
    };

    const newSites: Partial<SiteVO>[] = [];
    const invalidSites: { clientsSiteNumber: string }[] = [];
    const duplicatedSites: { clientsSiteNumber: string }[] = [];

    const importFile = async (
        data: Datum[],
        callback?: (
            {
                newItems,
                invalidItems,
                duplicatedItems
            }: { newItems: any[], invalidItems: any[], duplicatedItems: any[] }) => void
    ) => {
        startProgress(data.length);

        const importObjectsSaga = getImportObjectsSaga({newSites, invalidSites, duplicatedSites});
        // @ts-ignore
        await store.runSaga(importObjectsSaga, data);

        const fullDuration = getFullDuration(data.length);

        setTimeout(() => {
            callback?.({
                newItems: newSites,
                invalidItems: invalidSites,
                duplicatedItems: duplicatedSites,
            });

            setPercent(0);
            setFullDuration(0);
            clearInterval(interval);
        }, fullDuration);
    };

    const isImporting = percent > 0;

    return (
        <AppLayout>
            <Modal centered cancelButtonProps={{loading: isImporting}} open={isImporting} closable={false}
                   confirmLoading={isImporting}>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <ProgressCircle progress={Math.floor(percent)} label={'Импорт записей'}
                                    fullDuration={fullDuration}/>
                </div>
            </Modal>
            <ImportCard<Datum>
                onImport={importFile}
                sampleFileURL={'/assets/import-objects-example.xlsx'}
                xlsxCols={importSitesXlsxCols}
                title={'Импорт объектов и заказчиков'}
                imgURL={'/assets/import-objects-example.png'}
                importedItemsFound={'объектов с данными об адресах и заказчиках'}
            />
        </AppLayout>
    );
}
