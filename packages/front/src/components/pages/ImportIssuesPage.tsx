import {
    ISSUES,
    IssueVO,
    statusesList
} from 'iso/src/store/bootstrap/repos/issues';
import {
    byQueryGetters,
} from '../../utils/byQueryGetters';
import AppLayout from '../app/AppLayout';
import React from 'react';
import { useStore } from 'react-redux';
import {
    put,
    select
} from 'typed-redux-saga';
import { selectLedger } from 'iso/src/store/bootstrapDuck';
import { generateGuid } from '@sha/random';
import ImportCard from '../elements/ImportCard';

interface IIssue {
    clientsIssueNumber: string,
    clientsSiteNumber: string,
    description: string,
    registerDate: number,
    plannedDate: number,
    completedDate?: number,
    managerId?: string,
    engineerId?: string,
    technicianId?: string,
    estimatorId?: string,
    contacts?: string,
}

const formatExcelDate = (excelDate: number): string => {
    return excelDate ? new Date(Date.UTC(0, 0, excelDate - 1)).toDateString() : '';
};

export const importIssuesXlsxCols = [
    'clientsIssueNumber',
    'clientsSiteNumber',
    'description',
    'registerDate',
    'plannedDate',
    'completedDate',
    'managerId',
    'engineerId',
    'technicianId',
    'estimatorId',
    'contacts'
] as const;
type Datum = Record<typeof importIssuesXlsxCols[number], any>

function* importObjectsSaga(data: Datum[]) {
    let ledger: ReturnType<typeof selectLedger> = yield* select(selectLedger);

    const newIssues: Partial<IssueVO>[] = [];

    function* getOrCreateIssue({
                                   clientsIssueNumber,
                                   clientsSiteNumber,
                                   description,
                                   registerDate,
                                   plannedDate,
                                   completedDate,
                                   managerId,
                                   engineerId,
                                   technicianId,
                                   estimatorId,
                                   contacts
                               }: IIssue) {
        const byQueryGetter = yield* byQueryGetters();

        // @ts-ignore
        const site = yield byQueryGetter.siteByClientsNumber(clientsSiteNumber);
        // @ts-ignore
        const manager = yield byQueryGetter.userByClientsNumber(managerId);
        // @ts-ignore
        const estimator = yield byQueryGetter.userByClientsNumber(estimatorId);
        // @ts-ignore
        const engineer = yield byQueryGetter.employeeByClientsNumber(engineerId);
        // @ts-ignore
        const technician = yield byQueryGetter.employeeByClientsNumber(technicianId);

        // Проверка на существование такой заявки
        const foundIssue = ledger.issues.list.find(() => {
            return clientsSiteNumber === site.clientsSiteNumber;
        });

        // Если заявка новая
        if (!foundIssue) {
            const newIssue = {
                status: statusesList[0],
                [ISSUES.idProp]: generateGuid(),
                clientsIssueNumber,
                description,
                contacts,
                registerDate: formatExcelDate(registerDate),
                plannedDate: formatExcelDate(plannedDate),
                completedDate: formatExcelDate(completedDate),
                brandId: site.brandId,
                legalId: site.legalId,
                siteId: site.siteId,
                managerUserId: manager?.userId,
                clientsEngineerUserId: engineer?.userId,
                techUserId: technician?.userId,
                estimatorUserId: estimator?.userId,
                subId: '',
                contractId: '',
            };

            console.log(`Issue not found, create one`, newIssue.clientsIssueNumber);
            newIssues.push(newIssue);
        }

        return foundIssue;
    }

    for (let i = 0; i < data.length; i++) {
        const d = data[i];
        yield getOrCreateIssue({
            clientsIssueNumber: d.clientsIssueNumber,
            clientsSiteNumber: String(d.clientsSiteNumber),
            description: d.description,
            registerDate: d.registerDate,
            plannedDate: d.plannedDate,
            completedDate: d.completedDate,
            managerId: d.managerId,
            engineerId: d.engineerId,
            technicianId: d.technicianId,
            estimatorId: d.estimatorId,
            contacts: d.contacts,
        });
    }

    if (newIssues.length) {
        // @ts-ignore
        yield* put(ISSUES.actions.addedBatch(newIssues));
    }
}

/**
 * Deprecated: Задает цифровые номера для удобства копирования номеров в Excel
 *
 * function* prepareIdsObjectsSaga() {
 *     let ledger: ReturnType<typeof selectLedger> = yield* select(selectLedger);
 *     function* updateLedger() {
 *         ledger = yield* select(selectLedger);
 *     }
 *
 *     const mapper = (field) => (item, index) => ({ ...item, [field]: String(index) });
 *
 *     const newIssues = ledger.issues.list.reverse().map(mapper('clientsIssueNumber'));
 *     const newBrands = ledger.brands.list.reverse().map(mapper('clientsBrandNumber'));
 *     const newLegals = ledger.legals.list.reverse().map(mapper('clientsLegalNumber'));
 *     const newSites = ledger.sites.list.reverse().map(mapper('clientsSiteNumber'));
 *
 *     yield* put(ISSUES.actions.updatedBatch(newIssues));
 *     yield* put(BRANDS.actions.updatedBatch(newBrands));
 *     yield* put(LEGALS.actions.updatedBatch(newLegals));
 *     yield* put(SITES.actions.updatedBatch(newSites));
 * }
 *
 *  ImportIssuesPage:
 *
 *      const prepareIds = async () => {
 *         // @ts-ignore
 *         const task = store.runSaga(prepareIdsObjectsSaga);
 *         await task;
 *
 *         console.log('prepare ids complete');
 *     }
 *
 *     > return:
 *
 *         <Button onClick={prepareIds} disabled>обработать базу</Button>
 *
 */

export const ImportIssuesPage = () => {
    const store = useStore();
    const importFile = async (data: Datum[], callback?: () => void) => {
        // @ts-ignore
        const task = store.runSaga(importObjectsSaga, data);
        await task;

        callback?.();
    };

    return (
        <AppLayout
            title="Импорт заявок"
        >
            <ImportCard<Datum>
                onImport={importFile}
                sampleFileURL={'/assets/import-issues-example.xlsx'}
                xlsxCols={importIssuesXlsxCols}
                title={'Импорт заявок'}
                imgURL={'/assets/import-issues-example.png'}
                importedItemsFound={'объектов с данными о заявках'}
            />
        </AppLayout>
    );
};
