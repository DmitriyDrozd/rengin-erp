import {AttrFactories_ex, createEntitySlice} from "@shammasov/mydux";


import {ORMState} from "../orm";


const rawResource = createEntitySlice(
        'LEGALS',
        {
            legalName: AttrFactories_ex.string({
                headerName: 'Юр. Лицо',
                required: true,
            }),
            region: AttrFactories_ex.string({headerName: 'Регион', required: false}),
            brandId: AttrFactories_ex.itemOf({headerName:'Заказчик',linkedEID: 'BRANDS',required: true})
        },
        {
            langRU: {
                singular: 'Юр. Лицо',
                plural:'Юр. Лицa',
                some:"Юр. Лиц"
            }
        }
)
const selectValueEnumByBrandId = (brandId: string | undefined) => (state: ORMState) => {
    const allLegals = rawResource.selectors.selectAll(state) as any as LegalVO[]
    const filtered = allLegals.filter(legal => legal.brandId === brandId)
    return rawResource.asValueEnum(filtered)
}
export const LEGALS = {
    ...rawResource,
    selectValueEnumByBrandId,
}

export default LEGALS

export type LegalVO = (typeof LEGALS.exampleItem)