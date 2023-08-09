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
        //   region: valueTypes.string({headerName: 'Регион'}),
            brandId: valueTypes.itemOf({headerName:'Заказчик',linkedResourceName: 'BRANDS',required: true})
        },
        {
            langRU: {
                singular: 'Юр. Лицо',
                plural:'Юр. Лицa',
                some:"Юр. Лиц"
            }
        }
)

export const LEGALS = {
    ...rawResource,
    selectValueEnumByBrandId: (brandId: string | undefined) => (state: ISOState) =>
        rawResource.asValueEnum(rawResource.selectAll(state).filter(legal => legal.brandId === brandId))
}

export default LEGALS

export type LegalVO = (typeof LEGALS.exampleItem)