import AppLayout from '../app/AppLayout'
import React from 'react'
import BRANDS from 'iso/src/store/bootstrap/repos/brands'
import LEGALS from 'iso/src/store/bootstrap/repos/legals'
import SITES, {SiteVO} from 'iso/src/store/bootstrap/repos/sites'
import {sleep} from '@sha/utils'
import {useStore} from 'react-redux'
import {call, put, select} from 'typed-redux-saga'
import {selectLedger} from 'iso/src/store/bootstrapDuck'
import {generateGuid} from '@sha/random'
import ImportCard from "../elements/ImportCard";

export const importSitesXlsxCols = ['brandName','legalName','city','address'] as const
type Datum =Record<typeof importSitesXlsxCols[number], string>

function* importObjectsSaga(data: Datum[]) {

    let ledger: ReturnType<typeof selectLedger> = yield* select(selectLedger)

    function* updateLedger() {
        ledger = yield* select(selectLedger)
    }

    const newSites: Partial<SiteVO>[] = []

    function* getOrCreateSite(brandName: string, legalName: string,city: string, address: string) {
        let brand = ledger.brands.byName[brandName]
        if(!brand) {

            const action = BRANDS.actions.added({brandId: generateGuid(), brandName})
            console.log(`Brand ${brandName} not found, create one`, action)
            yield* put(action)

            yield* call(sleep, 10)
            yield* call(updateLedger)
        }
        else  {
            console.log(`Brand ${brandName} found`)
        }
        brand = ledger.brands.byName[brandName]


        let legal = ledger.legals.byName[legalName]
        if(!legal) {
            const action = LEGALS.actions.added({brandId: brand.brandId, legalId: generateGuid(), legalName})
            console.log(`Legal ${legalName} not found, create one`, action)
            yield* put(action)


            yield* call(sleep, 10)
            yield* call(updateLedger)
        }
        legal = ledger.legals.byName[legalName]


        let site = ledger.sites.find(s => s.brandId === brand.brandId && s.legalId === legal.legalId &&
                s.city === city && s.address === address
            )
        if(!site) {

            const site = {brandId: brand.brandId, legalId: legal.legalId, city, address, siteId: generateGuid()}
            console.log(`Site not found, create one`, site.address)
            newSites.push(site)
        }

        return site
    }

    for(let i = 0;i < data.length;i++) {
        const d = data[i]
        yield* call(getOrCreateSite, d.brandName, d.legalName, d.city,d.address)

    }
    if(newSites.length)
        yield* put(SITES.actions.addedBatch(newSites))

}

export default () => {
    const store = useStore()
    const importFile = async (data: Array<string[]>) => {
       const task =  store.runSaga(importObjectsSaga, data)
        await task


    }
    return <AppLayout>


            <ImportCard<Datum>
                onImport={importFile}
                sampleFileURL={'/assets/import-objects-example.xlsx'}
                xlsxCols={importSitesXlsxCols}
                title={"Импорт объектов и заказчиков"}
                imgURL={'/assets/import-objects-example.png'}
                importedItemsFound={"объектов с данными об адресах и заказчиках"}
            ></ImportCard>

    </AppLayout>
}
