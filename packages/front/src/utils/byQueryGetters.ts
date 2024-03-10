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
} from 'typed-redux-saga';

export const byQueryGetters = (ledger: ReturnType<typeof selectLedger>, updateLedger: () => void) => {
    return {
        brandById: function* (brandId: string) {
            let actualBrandId = brandId;

            if (!ledger.brands.byId[brandId]) {
                // fixme: вместо generateGuid brandId и подобные должен генерировать индекс MongoDB
                actualBrandId = generateGuid();
                const action = BRANDS.actions.added({brandId: actualBrandId});
                console.log(`Brand ${brandId} not found, create one`, action);
                yield* put(action);

                yield* call(sleep, 10);
                yield* call(updateLedger);
            } else {
                console.log(`Brand ${brandId} found`);
            }

            return ledger.brands.byId[actualBrandId] as BrandVO;
        },
        legalById: function* ({legalId, brandId}: { legalId: string, brandId: string }) {
            let actualLegalId = legalId;

            if (!ledger.legals.byId[legalId]) {
                actualLegalId = generateGuid();
                const action = LEGALS.actions.added({legalId: actualLegalId, brandId});
                console.log(`Legal ${legalId} not found, create one`, action);
                yield* put(action);

                yield* call(sleep, 10);
                yield* call(updateLedger);
            } else {
                console.log(`Legal ${legalId} found`);
            }

            return ledger.legals.byId[actualLegalId];
        },
        siteById: function* ({siteId, brandId, legalId}: { siteId: string, brandId: string, legalId: string }) {
            let actualSiteId = siteId;

            if (!ledger.sites.byId[siteId]) {
                actualSiteId = generateGuid();
                const action = SITES.actions.added({siteId: actualSiteId, brandId, legalId});
                console.log(`Site ${siteId} not found, create one`, action);
                yield* put(action);

                yield* call(sleep, 10);
                yield* call(updateLedger);
            } else {
                console.log(`Site ${siteId} found`);
            }

            return ledger.sites.byId[actualSiteId];
        },
        userById: function* (userId: string) {
            if (!userId || !ledger.users.byId[userId]) {
                console.log(`User ${userId} not found`);
                return {};
            } else {
                console.log(`User ${userId} found`);
                return ledger.users.byId[userId];
            }
        }
    };
};
