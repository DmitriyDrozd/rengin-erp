import AppLayout from '../app/AppLayout'
import React from 'react'
import {generateGuid, sleep} from '@shammasov/utils'
import {useStore} from 'react-redux'
import {call, put, select} from 'typed-redux-saga'

import ImportCard from "../elements/ImportCard";
import {BRANDS, Digest, LEGALS, selectDigest, SITES, SiteVO} from "iso";

export const importSitesXlsxCols = ['brandName','legalName','city','address'] as const
type Datum =Record<typeof importSitesXlsxCols[number], string>

function* importObjectsSaga(data: Datum[]) {

    let digest: Digest = yield* select(selectDigest)
    function* updateLedger() {
        digest = yield* select(selectDigest)
    }

    const newSites: Partial<SiteVO>[] = []

    function* getOrCreateSite(brandName: string, legalName: string,city: string, address: string) {
        let brand = digest.brands.byName[brandName]
        if(!brand) {

            const action = BRANDS.actions.added({id: generateGuid(), brandName})
            console.log(`Brand ${brandName} not found, create one`, action)
            yield* put(action)

            yield* call(sleep, 10)
            yield* call(updateLedger)
        }
        else  {
            console.log(`Brand ${brandName} found`)
        }
        brand = digest.brands.byName[brandName]


        let legal =digest.legals.byName[legalName]
        if(!legal) {
            const action = LEGALS.actions.added({brandId: brand.id, id: generateGuid(), legalName})
            console.log(`Legal ${legalName} not found, create one`, action)
            yield* put(action)


            yield* call(sleep, 10)
            yield* call(updateLedger)
        }
        legal = digest.legals.byName[legalName]


        let site = digest.sites.list.find( s => s.brandId === brand.id && s.legalId === legal.id &&
                s.city === city && s.address === address
            )
        if(!site) {

            const site = {brandId: brand.id, legalId: legal.id, city, address, siteId: generateGuid()}
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
        yield* put(SITES.actions.manyAdded(newSites))

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
