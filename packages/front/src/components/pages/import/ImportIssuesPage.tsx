import dayjs from 'dayjs';
import {
    ISSUES,
    IssueVO,
    statusesList
} from 'iso/src/store/bootstrap/repos/issues';
import {
    byQueryGetters,
    getItemNumberGenerator,
} from '../../../utils/byQueryGetters';
import AppLayout from '../../app/AppLayout';
import React from 'react';
import { useStore } from 'react-redux';
import {
    put,
    select,
    take,
} from 'typed-redux-saga';
import { selectLedger } from 'iso/src/store/bootstrapDuck';
import { generateGuid } from '@sha/random';
import ImportCard from '../../elements/ImportCard';
import { rejectFn } from './helper';

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

const TIME_ZONE_NOVOSIBIRSK = '+0700';

const formatExcelDate = (excelDate: number | string): string => {
    if (!excelDate) {
        return '';
    }

    if (typeof excelDate === 'number') {
        const result = new Date(Date.UTC(0, 0, excelDate - 1))?.toISOString();

        if (result !== 'Invalid Date') {
            return result;
        }
    }

    const timezoneDate = `${excelDate} ${TIME_ZONE_NOVOSIBIRSK}`;
    const tryOne = dayjs(timezoneDate, 'DD.MM.YYYY HH:mm:ss ZZ');

    if (tryOne.isValid()) {
        return tryOne.toDate().toISOString();
    }

    const tryTwo = dayjs(excelDate);

    if (tryTwo.isValid()) {
        return tryTwo.toDate().toISOString();
    }

    return new Date(Date.UTC(0, 0, excelDate - 1))?.toDateString();
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

const getImportIssuesSaga = ({ newIssues, invalidIssues, duplicatedIssues }: { newIssues: any[], invalidIssues: any[], duplicatedIssues: any[] }) => {
    const generateClientsNumber = getItemNumberGenerator();

    function* importIssuesSaga(data: Datum[]) {
        let ledger: ReturnType<typeof selectLedger> = yield* select(selectLedger);

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
            const site = yield* byQueryGetter.siteByClientsNumber(clientsSiteNumber);

            if (!site) {
                const error = 'не найден обьект';
                invalidIssues.push({clientsNumber: clientsIssueNumber, clientsSiteNumber, error});
                return null;
            }

            // @ts-ignore
            const manager = yield* byQueryGetter.userByClientsNumber(managerId);
            // @ts-ignore
            const estimator = yield* byQueryGetter.userByClientsNumber(estimatorId);
            // @ts-ignore
            const engineer = yield* byQueryGetter.employeeByClientsNumber(engineerId);
            // @ts-ignore
            const technician = yield* byQueryGetter.employeeByClientsNumber(technicianId);

            const issueNumber = clientsIssueNumber || generateClientsNumber(ledger.issues.list, 'clientsIssueNumber');
            // Проверка на существование такой заявки
            const foundIssue = ledger.issues.list.find((issue) => {
                return String(issueNumber) === issue.clientsIssueNumber;
            });

            // Если заявка новая
            if (!foundIssue) {
                const formattedRegisterDate = formatExcelDate(registerDate);
                const formattedPlannedDate = formatExcelDate(plannedDate);
                const formattedCompletedDate = formatExcelDate(completedDate);

                if ([formattedRegisterDate, formattedPlannedDate, formattedCompletedDate].includes('Invalid Date')) {
                    const error = 'неверный формат даты';
                    invalidIssues.push({clientsNumber: clientsIssueNumber, clientsSiteNumber, error});
                    return null;
                }

                const newIssue = {
                    status: statusesList[0],
                    [ISSUES.idProp]: generateGuid(),
                    clientsIssueNumber: String(issueNumber),
                    description,
                    contacts,
                    registerDate: formattedRegisterDate,
                    plannedDate: formattedPlannedDate,
                    completedDate: formattedCompletedDate,
                    brandId: site.brandId,
                    legalId: site.legalId,
                    siteId: site.siteId,
                    managerUserId: manager?.userId || site?.managerUserId,
                    clientsEngineerUserId: engineer?.employeeId || site?.clientsEngineerUserId,
                    techUserId: technician?.employeeId || site?.techUserId,
                    estimatorUserId: estimator?.userId || site?.estimatorUserId,
                    subId: '',
                    contractId: '',
                };


                console.log(`Issue not found, create one`, newIssue.clientsIssueNumber);
                newIssues.push(rejectFn(newIssue));
            } else {
                duplicatedIssues.push({clientsNumber: issueNumber || clientsIssueNumber});
            }

            return foundIssue;
        }

        for (let i = 0; i < data.length; i++) {
            const d = data[i];
            yield* getOrCreateIssue({
                clientsIssueNumber: d.clientsIssueNumber,
                clientsSiteNumber: d.clientsSiteNumber,
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

        yield* put(ISSUES.actions.addedBatch(newIssues));
    }

    return importIssuesSaga;
};

function* awaitIssuesSaga (callback = () => {}) {
    yield* take(ISSUES.actions.addedBatch);
    callback();
}

export const ImportIssuesPage = () => {
    const store = useStore();
    const importFile = async (
        data: Datum[],
        callback?: ({
                        newItems,
                        invalidItems,
                        duplicatedItems
                    }: { newItems: any[], invalidItems: any[], duplicatedItems: any[] }) => void) => {
        const newIssues: Partial<IssueVO>[] = [];
        const invalidIssues: { clientsNumber: string, clientsSiteNumber: string }[] = [];
        const duplicatedIssues: { clientsNumber: string }[] = [];

        const importIssuesSaga = getImportIssuesSaga({ newIssues, invalidIssues, duplicatedIssues });

        // @ts-ignore
        await store.runSaga(importIssuesSaga, data);
        // @ts-ignore
        await store.runSaga(awaitIssuesSaga, () => callback?.({
            newItems: newIssues,
            invalidItems: invalidIssues,
            duplicatedItems: duplicatedIssues,
        }))
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
