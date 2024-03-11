import {
    ISSUES,
    IssueVO,
    statusesList
} from 'iso/src/store/bootstrap/repos/issues';
import { byQueryGetters } from '../../utils/byQueryGetters';
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
    siteId: string,
    description: string,
    registerDate: number,
    plannedDate: number,
    completedDate?: number,
    managerId?: string,
    engineerId?: string,
    technicianId?: string,
}

const formatExcelDate = (excelDate: number): string => {
    return excelDate ? new Date(Date.UTC(0, 0, excelDate - 1)).toDateString() : '';
}

// fixme: тайтл страницы: [object Object]
export const importIssuesXlsxCols = [
    'clientsIssueNumber',
    'siteId',
    'description',
    'registerDate',
    'plannedDate',
    'completedDate',
    'managerId',
    'engineerId',
    'technicianId',
] as const;
type Datum = Record<typeof importIssuesXlsxCols[number], any>

function* importObjectsSaga(data: Datum[]) {
    let ledger: ReturnType<typeof selectLedger> = yield* select(selectLedger);

    const newIssues: Partial<IssueVO>[] = [];

    function* getOrCreateIssue({
                                   clientsIssueNumber,
                                   siteId,
                                   description,
                                   registerDate,
                                   plannedDate,
                                   completedDate,
                                   managerId,
                                   engineerId,
                                   technicianId,
                               }: IIssue) {
        const byQueryGetter = yield* byQueryGetters();

        // @ts-ignore
        const site = yield byQueryGetter.siteById(siteId);
        // @ts-ignore
        const manager = yield byQueryGetter.userById(managerId);
        // @ts-ignore
        const engineer = yield byQueryGetter.userById(engineerId);
        // @ts-ignore
        const technician = yield byQueryGetter.userById(technicianId);

        // Проверка на существование такой заявки
        const foundIssue = ledger.issues.list.find(({brandId, legalId, siteId, clientsIssueNumber: issueNumber}) => {
            return brandId === site.brandId &&
                legalId === site.legalId &&
                siteId === site.siteId &&
                issueNumber === clientsIssueNumber;
        });

        // Если заявка новая
        if (!foundIssue) {
            const newIssue = {
                status: statusesList[0],
                [ISSUES.idProp]: generateGuid(),
                clientsIssueNumber,
                description,
                registerDate: formatExcelDate(registerDate),
                plannedDate: formatExcelDate(plannedDate),
                completedDate: formatExcelDate(completedDate),
                brandId: site.brandId,
                legalId: site.legalId,
                siteId: site.siteId,
                managerUserId: manager?.userId,
                clientsEngineerUserId: engineer?.userId,
                techUserId: technician?.userId,
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
            siteId: d.siteId,
            description: d.description,
            registerDate: d.registerDate,
            plannedDate: d.plannedDate,
            completedDate: d.completedDate,
            managerId: d.managerId,
            engineerId: d.engineerId,
            technicianId: d.technicianId,
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
        const task = store.runSaga(importObjectsSaga, data);
        await task;

        callback?.();
    };

    return (
        <AppLayout
            title='Импорт заявок'
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
