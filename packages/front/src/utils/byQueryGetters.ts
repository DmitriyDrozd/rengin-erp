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

export function* byQueryGetters () {
    let ledger: ReturnType<typeof selectLedger> = yield* select(selectLedger);
    function* updateLedger() {
        ledger = yield* select(selectLedger);
    }

    function* brandById (brandId: string) {
        let actualBrandId = brandId;

        if (!ledger.brands.byId[actualBrandId]) {
            // fixme: вместо generateGuid brandId и подобные должен генерировать индекс MongoDB
            actualBrandId = generateGuid();
            const action = BRANDS.actions.added({
                brandId: actualBrandId,
                brandName: 'Автоматически созданный заказчик',
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

            console.log(`Brand ${brandId} not found, create one`, action);
        } else {
            console.log(`Brand ${brandId} found`);
        }

        return ledger.brands.byId[actualBrandId] as BrandVO;
    }

    function* legalById ({legalId, brandId}: {
        legalId: string,
        brandId: string
    }) {
        let actualLegalId = legalId;

        if (!ledger.legals.byId[actualLegalId]) {
            actualLegalId = generateGuid();
            const action = LEGALS.actions.added({
                brandId,
                legalId: actualLegalId,
                legalName: 'Автоматически созданное юр. лицо',
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
    function* siteById (siteId: string) {
        let actualSiteId = siteId;

        if (!ledger.sites.byId[siteId]) {
            actualSiteId = generateGuid();

            const newBrand = yield* call(brandById, '');
            const newLegal = yield* call(legalById, {legalId: '', brandId: newBrand.brandId});

            const action = SITES.actions.added({
                siteId: actualSiteId,
                brandId: newBrand.brandId,
                legalId: newLegal.legalId,
                address: 'Автоматически созданный объект',
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

            console.log(`Site ${siteId} not found, create one`, action);
        } else {
            console.log(`Site ${siteId} found`);
        }

        return ledger.sites.byId[actualSiteId];
    }

    function* userById (userId: string) {
        if (!userId || !ledger.users.byId[userId]) {
            console.log(`User ${userId} not found`);
            return {};
        } else {
            console.log(`User ${userId} found`);
            return ledger.users.byId[userId];
        }
    }

    return {
        brandById,
        legalById,
        siteById,
        userById,
    };
}
