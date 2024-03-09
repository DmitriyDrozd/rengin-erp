import { generateGuid } from '@sha/random';
import { sleep } from '@sha/utils';
import BRANDS from 'iso/src/store/bootstrap/repos/brands';
import LEGALS from 'iso/src/store/bootstrap/repos/legals';
import { selectLedger } from 'iso/src/store/bootstrapDuck';
import {
    call,
    put,
} from 'typed-redux-saga';

export const byQueryGetters = (ledger: ReturnType<typeof selectLedger>, updateLedger: () => void) => {
    return {
        brandByName: function* (brandName: string) {
            if (!ledger.brands.byName[brandName]) {
                const action = BRANDS.actions.added({brandId: generateGuid(), brandName});
                console.log(`Brand ${brandName} not found, create one`, action);
                yield* put(action);

                yield* call(sleep, 10);
                yield* call(updateLedger);
            } else {
                console.log(`Brand ${brandName} found`);
            }

            return ledger.brands.byName[brandName];
        },
        legalByName: function* (legalName: string, brandId: string) {
            if (!ledger.legals.byName[legalName]) {
                const action = LEGALS.actions.added({brandId, legalId: generateGuid(), legalName});
                console.log(`Legal ${legalName} not found, create one`, action);
                yield* put(action);

                yield* call(sleep, 10);
                yield* call(updateLedger);
            } else {
                console.log(`Legal ${legalName} found`);
            }

            return ledger.legals.byName[legalName];
        }
    };
};
