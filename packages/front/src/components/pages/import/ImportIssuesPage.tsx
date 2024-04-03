import {
    ISSUES,
    IssueVO,
    statusesList
} from 'iso/src/store/bootstrap/repos/issues';
import {
    byQueryGetters,
    generateNewListItemNumber,
} from '../../../utils/byQueryGetters';
import AppLayout from '../../app/AppLayout';
import React from 'react';
import { useStore } from 'react-redux';
import {
    put,
    select
} from 'typed-redux-saga';
import { selectLedger } from 'iso/src/store/bootstrapDuck';
import { generateGuid } from '@sha/random';
import ImportCard from '../../elements/ImportCard';
import * as R from "ramda";

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

function* importIssuesSaga(data: Datum[]) {
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
        const manager = yield byQueryGetter.employeeByClientsNumber(managerId);
        // @ts-ignore
        const estimator = yield byQueryGetter.employeeByClientsNumber(estimatorId);
        // @ts-ignore
        const engineer = yield byQueryGetter.employeeByClientsNumber(engineerId);
        // @ts-ignore
        const technician = yield byQueryGetter.employeeByClientsNumber(technicianId);

        const issueNumber = clientsIssueNumber || generateNewListItemNumber(ledger.issues.list, 'clientsIssueNumber', newIssues.length);
        // Проверка на существование такой заявки
        const foundIssue = ledger.issues.list.find((issue) => {
            return issueNumber === issue.clientsIssueNumber;
        });

        // Если заявка новая
        if (!foundIssue) {
            const newIssue = {
                status: statusesList[0],
                [ISSUES.idProp]: generateGuid(),
                clientsIssueNumber: issueNumber,
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
            newIssues.push(R.reject(R.anyPass([R.isEmpty, R.isNil]))(newIssue));
        }

        return foundIssue;
    }

    for (let i = 0; i < data.length; i++) {
        const d = data[i];
        yield getOrCreateIssue({
            clientsIssueNumber: String(d.clientsIssueNumber),
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

export const ImportIssuesPage = () => {
    const store = useStore();
    const importFile = async (data: Datum[], callback?: () => void) => {
        // @ts-ignore
        await store.runSaga(importIssuesSaga, data);

        setTimeout(() => {
            callback?.();
        }, 1000);
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
