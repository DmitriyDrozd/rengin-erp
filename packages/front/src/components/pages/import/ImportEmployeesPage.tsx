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
    select
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

function* importEmployeesSaga(data: Datum[]) {
    const generateClientsNumber = getItemNumberGenerator();
    const newEmployees: Partial<EmployeeVO>[] = [];

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
        const brand = yield byQueryGetter.brandByClientsNumber(clientsBrandNumber, false);

        const foundEmployee = ledger.employees.list.find((employee) => {
            return role === employee.role && name === employee.name && (lastname ? lastname === employee.lastname : true);
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
            newEmployees.push(R.reject(R.anyPass([R.isEmpty, R.isNil]))(newEmployee));
        }

        return foundEmployee;
    }

    for (let i = 0; i < data.length; i++) {
        const d = data[i];
        yield getOrCreateEmployee({
            role: d.role,
            name: d.name,
            clientsBrandNumber: String(d.clientsBrandNumber),
            title: d.title,
            phone: d.phone,
            city: d.city,
            region: d.region,
            department: d.department,
            sourceLink: d.sourceLink,
            timezone: d.timezone,
            searchType: d.searchType,
            managerComment: d.managerComment,
            employeeComment: d.employeeComment,
        });
    }

    if (newEmployees.length) {
        // @ts-ignore
        yield* put(EMPLOYEES.actions.addedBatch(newEmployees));
    }
}

export const ImportEmployeesPage = () => {
    const store = useStore();
    const importFile = async (data: Datum[], callback?: () => void) => {
        // @ts-ignore
        const task = store.runSaga(importEmployeesSaga, data);
        await task;

        callback?.();
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
