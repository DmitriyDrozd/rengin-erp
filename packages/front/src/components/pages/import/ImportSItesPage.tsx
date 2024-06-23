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
const chunkImportInterval = 120 * CHUNK_SIZE;

const getImportObjectsSaga = ({newSites, invalidSites, duplicatedSites}: { newSites: any[], invalidSites: any[], duplicatedSites: any[] }) => {
    const generateClientsNumber = getItemNumberGenerator();

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
            let legal = ledger.legals.byName[legalName];

            if (!brand) {
                const action = BRANDS.actions.added({
                    brandId: generateGuid(),
                    brandName,
                    address: `${city}, ${address}`,
                    clientsBrandNumber: generateClientsNumber(ledger.brands.list, 'clientsBrandNumber'),
                    brandType: 'Заказчик',
                    person: '',
                    email: '',
                    phone: '',
                    web: '',
                    managerUserId: '',
                    removed: false
                });
                console.log(`Brand ${brandName} not found, create one`, action);
                yield* put(action);

                yield* call(sleep, 10);
                yield* call(updateLedger);
            } else {
                console.log(`Brand ${brandName} found`);
            }

            brand = ledger.brands.byName[brandName];

            if (!legal) {
                const action = LEGALS.actions.added({
                    brandId: brand.brandId,
                    legalId: generateGuid(),
                    legalName,
                    region: city,
                    clientsLegalNumber: generateClientsNumber(ledger.legals.list, 'clientsLegalNumber'),
                });
                console.log(`Legal ${legalName} not found, create one`, action);
                yield* put(action);

                yield* call(sleep, 10);
                yield* call(updateLedger);
            }
            legal = ledger.legals.byName[legalName];

            let site = ledger.sites.list.find(s => s.brandId === brand.brandId && s.legalId === legal.legalId &&
                s.city === city && s.address === address);

            if (!site) {
                const site = {
                    brandId: brand.brandId,
                    legalId: legal.legalId,
                    city,
                    address,
                    siteId: generateGuid(),
                    clientsSiteNumber: clientsSiteNumber
                        ? String(clientsSiteNumber)
                        : generateClientsNumber(ledger.sites.list, 'clientsSiteNumber'),
                };
                console.log(`Site not found, create one`, site.address);
                newSites.push(rejectFn(site));
            } else {
                duplicatedSites.push({clientsNumber: site.clientsSiteNumber});
            }

            return site;
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

export default () => {
    const store = useStore();
    const [percent, setPercent] = useState(0);
    const [fullDuration, setFullDuration] = useState(0);

    const startProgress = (dataLength: number) => {
        let _percent = percent || 0;

        const ledgerDuration = dataLength * (AVERAGE_CREATE_TIME + importInterval);
        const creationDuration = dataLength > CHUNK_SIZE ? (Math.ceil(dataLength / CHUNK_SIZE) * chunkImportInterval) : 0;
        const fullDuration = ledgerDuration + creationDuration;
        const progressInterval = fullDuration / 100;

        setPercent(1);
        interval = setInterval(() => {
            _percent += 1;
            setPercent(_percent);
        }, progressInterval);

        setFullDuration(fullDuration);
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

        // @ts-ignore
        const task = store.runSaga(getImportObjectsSaga({newSites, invalidSites, duplicatedSites}), data);
        await task;

        const ledgerDuration = data.length * (AVERAGE_CREATE_TIME + importInterval);
        const creationDuration = data.length > CHUNK_SIZE ? (Math.ceil(data.length / CHUNK_SIZE) * chunkImportInterval) : 0;

        setTimeout(() => {
            callback?.({
                newItems: newSites,
                invalidItems: invalidSites,
                duplicatedItems: duplicatedSites,
            });

            setPercent(0);
            setFullDuration(0);
            clearInterval(interval);
        }, ledgerDuration + creationDuration);
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
