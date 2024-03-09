import {
    ISSUES,
    IssueVO
} from 'iso/src/store/bootstrap/repos/issues';
import { byQueryGetters } from '../../utils/byQueryGetters';
import AppLayout from '../app/AppLayout';
import React from 'react';
import { useStore } from 'react-redux';
import {
    call,
    put,
    select
} from 'typed-redux-saga';
import { selectLedger } from 'iso/src/store/bootstrapDuck';
import { generateGuid } from '@sha/random';
import ImportCard from '../elements/ImportCard';

// todo: тайтл страницы: [object Object]
//Объект	Договор	Описание	Дата регистрации	Начало работ	Дата завершения	Смета согласована	Смета сумма	Расходы	Статус
export const importIssuesXlsxCols = [
    'clientsIssueNumber',
    'brandName',
    'legalName',
    'siteAddress',
    'contractNumber',
    'description',
    'registerDate',
    'workStartedDate',
    'completedDate',
    'estimationsApproved',
    'estimatePrice',
    'expensePrice',
    'status',
] as const;
type Datum = Record<typeof importIssuesXlsxCols[number], any>

function* importObjectsSaga(data: Datum[]) {

    let ledger: ReturnType<typeof selectLedger> = yield* select(selectLedger);

    function* updateLedger() {
        ledger = yield* select(selectLedger);
    }

    const newIssues: Partial<IssueVO>[] = [];

    function* getOrCreateIssue(
        clientsIssueNumber: string,
        brandName: string,
        legalName: string,
        siteAddress: string,
        contractNumber: string,
        description: string,
        registerDate: Date,
        workStartedDate: Date,
        completedDate: Date,
        estimationsApproved: boolean,
        estimatePrice: number,
        expensePrice: number,
        status: string,
    ) {
        const byQueryGetter = byQueryGetters(ledger, updateLedger);

        const brand = byQueryGetter.brandByName(brandName);
        const legal = byQueryGetter.legalByName(legalName, brand.brandId);

        // Проверка на существование такой заявки
        let issue = ledger.issues.list.find(s => s.brandId === brand.brandId && s.legalId === legal.legalId && s.clientsIssueNumber === clientsIssueNumber);

        // Если заявка новая
        if (!issue) {
            const newIssue = {
                brandId: brand.brandId,
                legalId: legal.legalId,
                clientsIssueNumber,
                [ISSUES.idProp]: generateGuid(),
            };
            console.log(`Issue not found, create one`, newIssue.clientsIssueNumber);
            newIssues.push(newIssue);
        }

        return issue;
    }

    for (let i = 0; i < data.length; i++) {
        const d = data[i];
        yield* call(getOrCreateIssue,
            d.clientsIssueNumber,
            d.brandName,
            d.legalName,
            d.siteAddress,
            d.contractNumber,
            d.description,
            d.registerDate,
            d.workStartedDate,
            d.completedDate,
            d.estimationsApproved,
            d.estimatePrice,
            d.expensePrice,
            d.status,
        );
    }

    if (newIssues.length) {
        yield* put(ISSUES.actions.addedBatch(newIssues));
    }
}

export const ImportIssuesPage = () => {
    const store = useStore();
    const importFile = async (data: Array<string[]>) => {
        const task = store.runSaga(importObjectsSaga, data);
        await task;
    };

    return (
        <AppLayout>
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
