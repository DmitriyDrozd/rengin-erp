import { generateGuid } from '@sha/random';
import { sleep } from '@sha/utils';
import {
    SITES,
} from 'iso/src/store/bootstrap';
import BRANDS, { BrandVO } from 'iso/src/store/bootstrap/repos/brands';
import LEGALS from 'iso/src/store/bootstrap/repos/legals';
import { selectLedger } from 'iso/src/store/bootstrapDuck';
import {
    call,
    put,
    select,
} from 'typed-redux-saga';

export const generateNewListItemNumber = (list: any[], accessor: string, shift: number = 0): string => {
    const lastItemNumber = list.reduce((acc, item) => {
        const currentNumber = +item[accessor];

        if (isNaN(currentNumber)) {
            return acc;
        }

        return currentNumber > acc ? currentNumber : acc;
    }, 0);

    return String(lastItemNumber + 1 + shift);
};

export function* byQueryGetters () {
    let ledger: ReturnType<typeof selectLedger> = yield* select(selectLedger);
    function* updateLedger() {
        ledger = yield* select(selectLedger);
    }

    function* brandByClientsNumber (clientsBrandNumber: string, createIfNotFound = true) {
        let actualBrandNumber = String(clientsBrandNumber);

        if (!ledger.brands.list.find(brand => brand.clientsBrandNumber === actualBrandNumber) && createIfNotFound) {
            actualBrandNumber = generateNewListItemNumber(ledger.brands.list, 'clientsBrandNumber');
            // fixme: вместо generateGuid brandId и подобные должен генерировать индекс MongoDB
            const action = BRANDS.actions.added({
                clientsBrandNumber: actualBrandNumber,
                brandId: generateGuid(),
                brandName: 'Автоматически созданный заказчик' + actualBrandNumber,
                brandType: 'Заказчик',
                person: '',
                email: '',
                phone: '',
                address: '',
                web: '',
                managerUserId: '',
                removed: false
            });

            yield* put(action);
            yield* call(sleep, 10);
            yield* call(updateLedger);

            console.log(`Brand ${clientsBrandNumber} not found, create one`, action);
        } else {
            console.log(`Brand ${clientsBrandNumber} found`);
        }

        return ledger.brands.list.find(brand => brand.clientsBrandNumber === actualBrandNumber) as BrandVO;
    }

    function* legalById ({legalId, brandId}: {
        legalId: string,
        brandId: string
    }) {
        let actualLegalId = legalId;

        if (!ledger.legals.byId[actualLegalId]) {
            actualLegalId = generateGuid();
            const clientsLegalNumber = generateNewListItemNumber(ledger.legals.list, 'clientsLegalNumber');
            const action = LEGALS.actions.added({
                brandId,
                clientsLegalNumber,
                legalId: actualLegalId,
                legalName: 'Автоматически созданное юр. лицо' + clientsLegalNumber,
                region: ''
            });

            yield* put(action);
            yield* call(sleep, 10);
            yield* call(updateLedger);

            console.log(`Legal ${legalId} not found, create one`, action);
        } else {
            console.log(`Legal ${legalId} found`);
        }

        return ledger.legals.byId[actualLegalId];
    }


    // @ts-ignore
    function* siteByClientsNumber (clientsSiteNumber: string) {
        let actualClientsSiteNumber = String(clientsSiteNumber);

        const siteByNumberFind = (({ clientsSiteNumber: value }: { clientsSiteNumber: string }) => value === actualClientsSiteNumber);

        if (!ledger.sites.list.find(siteByNumberFind)) {
            actualClientsSiteNumber = generateNewListItemNumber(ledger.sites.list, 'clientsSiteNumber');

            const newBrand = yield* call(brandByClientsNumber, '');
            const newLegal = yield* call(legalById, {legalId: '', brandId: newBrand.brandId});

            const action = SITES.actions.added({
                clientsSiteNumber: actualClientsSiteNumber,
                siteId: generateGuid(),
                brandId: newBrand.brandId,
                legalId: newLegal.legalId,
                address: 'Автоматически созданный объект' + actualClientsSiteNumber,
                city: '-',
                contactInfo: '',
                KPP: '',
                managerUserId: '',
                techUserId: '',
                clientsEngineerUserId: ''
            });

            yield* put(action);
            yield* call(sleep, 10);
            yield* call(updateLedger);

            console.log(`Site ${clientsSiteNumber} not found, create one`, action);
        } else {
            console.log(`Site ${clientsSiteNumber} found`);
        }

        return ledger.sites.list.find(siteByNumberFind);
    }

    function* userByClientsNumber (clientsNumber: string) {
        const foundUser = ledger.users.list.find(user => String(user.clientsUserNumber) === String(clientsNumber));

        if (!clientsNumber || !foundUser) {
            console.log(`User ${clientsNumber} not found`);
            return null;
        } else {
            console.log(`User ${clientsNumber} found`);
            return foundUser;
        }
    }

    function* employeeByClientsNumber (clientsNumber: string | number) {
        const foundEmployee = ledger.employees.list.find(user => String(user.clientsEmployeeNumber) === String(clientsNumber));

        if (!clientsNumber || !foundEmployee) {
            console.log(`Employee ${clientsNumber} not found`);
            return null;
        } else {
            console.log(`Employee ${clientsNumber} found`);
            return foundEmployee;
        }
    }

    return {
        brandByClientsNumber,
        legalById,
        siteByClientsNumber,
        userByClientsNumber,
        employeeByClientsNumber,
    };
}
