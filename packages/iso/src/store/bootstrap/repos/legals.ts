import {createResource} from '../core/createResource'
import {valueTypes} from '../core/valueTypes'
import {ISOState} from '../../../ISOState'


const rawResource = createResource(
        'legal',
        {
            legalName: valueTypes.string({
                headerName: 'Юр. Лицо',
                required: true,
            }),
            region: valueTypes.string({headerName: 'Регион', required: false}),
            brandId: valueTypes.itemOf({headerName:'Заказчик',linkedResourceName: 'BRANDS',required: true}),
            clientsLegalNumber: valueTypes.string({headerName:'Номер', required: true, immutable: true}),
        },
        {
            langRU: {
                singular: 'Юр. Лицо',
                plural:'Юр. Лицa',
                some:"Юр. Лиц"
            }
        }
)
export const selectValueEnumByBrandId = (brandId: string | undefined) => (state: ISOState) => {
    const allLegals = rawResource.selectAll(state) as any as LegalVO[]
    const filtered = allLegals.filter(legal => legal.brandId === brandId)
    return rawResource.asValueEnum(filtered)
}
export const LEGALS = {
    ...rawResource,
    selectValueEnumByBrandId,
    clientsNumberProp: 'clientsLegalNumber'
}

export default LEGALS

export type LegalVO = (typeof LEGALS.exampleItem)