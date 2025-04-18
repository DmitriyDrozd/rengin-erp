import {
    EMPLOYEES,
    EmployeeVO
} from 'iso/src/store/bootstrap/repos/employees';
import * as R from 'ramda';
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

interface IEmployee {
    role: string,
    name: string,
    clientsBrandNumber: string,
    title: string,
    phone: string,
    city: string,
    region: string,
    department: string,
    sourceLink: string,
    timezone: string,
    searchType: string,
    managerComment: string,
    employeeComment: string,
}

export const importIssuesXlsxCols = [
    'role',
    'name',
    'clientsBrandNumber',
    'title',
    'phone',
    'city',
    'region',
    'department',
    'sourceLink',
    'timezone',
    'searchType',
    'managerComment',
    'employeeComment',
] as const;
type Datum = Record<typeof importIssuesXlsxCols[number], any>

const getImportEmployeeSaga = ({ newItems, invalidItems, duplicatedItems }: { newItems: Partial<EmployeeVO>[], invalidItems: any[], duplicatedItems: any[] }) => {
    const generateClientsNumber = getItemNumberGenerator();

    function* importEmployeesSaga(data: Datum[]) {
        let ledger: ReturnType<typeof selectLedger> = yield* select(selectLedger);
    
        function* getOrCreateEmployee({
                                        role,
                                        name,
                                        clientsBrandNumber,
                                        title,
                                        phone,
                                        city,
                                        region,
                                        department,
                                        sourceLink,
                                        timezone,
                                        searchType,
                                        managerComment,
                                        employeeComment,
                                    }: IEmployee) {
            const byQueryGetter = yield* byQueryGetters();
    
            // @ts-ignore
            const brand = yield* byQueryGetter.brandByClientsNumber(clientsBrandNumber, false);
    
            const foundEmployee = ledger.employees.list.find((employee) => {
                return role == employee.role && name == employee.name && phone == employee.phone && title == employee.title;
            });
    
            if (!foundEmployee) {
                const clientsEmployeeNumber = generateClientsNumber(ledger.employees.list, 'clientsEmployeeNumber');
                const newEmployee = {
                    role,
                    name,
                    phone,
                    title,
                    clientsEmployeeNumber,
                    [EMPLOYEES.idProp]: generateGuid(),
                    brandId: brand?.brandId,
                    city,
                    region,
                    department,
                    sourceLink,
                    timezone,
                    searchType,
                    managerComment,
                    employeeComment,
                };
    
                console.log(`Employee not found, create one`, newEmployee.clientsEmployeeNumber);
                newItems.push(R.reject(R.anyPass([R.isEmpty, R.isNil]))(newEmployee));
            } else {
                duplicatedItems.push({ clientsNumber: foundEmployee.clientsEmployeeNumber });
            }
    
            return foundEmployee;
        }
    
        for (let i = 0; i < data.length; i++) {
            const d = data[i];
            const role = d.role?.trim();
            const timezone = d.timezone?.toString();

            yield getOrCreateEmployee({
                role,
                name: d.name,
                clientsBrandNumber: String(d.clientsBrandNumber),
                title: d.title,
                phone: d.phone,
                city: d.city,
                region: d.region,
                department: d.department,
                sourceLink: d.sourceLink,
                timezone,
                searchType: d.searchType,
                managerComment: d.managerComment,
                employeeComment: d.employeeComment,
            });
        }
    
        // @ts-ignore
        yield* put(EMPLOYEES.actions.addedBatch(newItems));
    }

    return importEmployeesSaga;
}

function* awaitEmployeesSaga (callback = () => {}) {
    yield* take(EMPLOYEES.actions.addedBatch);
    callback();
}

export const ImportEmployeesPage = () => {
    const store = useStore();
    const importFile = async (data: Datum[], callback?: ({
        newItems,
        invalidItems,
        duplicatedItems
    }: { newItems: any[], invalidItems: any[], duplicatedItems: any[] }) => void) => {
        const newItems: Partial<EmployeeVO>[] = [];
        const invalidItems: { clientsNumber: string }[] = [];
        const duplicatedItems: { clientsNumber: string }[] = [];

        const importEmployeesSaga = getImportEmployeeSaga({ newItems, invalidItems, duplicatedItems });
        // @ts-ignore
        await store.runSaga(importEmployeesSaga, data);
        // @ts-ignore
        await store.runSaga(awaitEmployeesSaga, () => callback?.({
            newItems,
            invalidItems,
            duplicatedItems,
        }))
    };

    return (
        <AppLayout
            title="Импорт заявок"
        >
            <ImportCard<Datum>
                onImport={importFile}
                sampleFileURL={'/assets/import-employees-example.xlsx'}
                xlsxCols={importIssuesXlsxCols}
                title={'Импорт сотрудников'}
                imgURL={'/assets/import-employees-example.png'}
                importedItemsFound={'объектов с данными о сотрудниках'}
            />
        </AppLayout>
    );
};
