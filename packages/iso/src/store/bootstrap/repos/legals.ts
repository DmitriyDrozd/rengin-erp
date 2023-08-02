import {createResource} from '../core/createResource'
import {valueTypes} from '../core/valueTypes'

export const LEGALS = createResource(
        'legal',
        {
            legalName: valueTypes.string({
                headerName: 'Юр. Лицо',
                required: true,
                name: 'legalName'
            }),
            region: valueTypes.string({headerName: 'Регион'}),



            brandId: valueTypes.itemOf({headerName:'Заказчик',res: 'BRANDS',required: true})
        },
        {
            langRU: {
                singular: 'Юр. Лицо',
                plural:'Юр. Лицa',
                some:"Юр. Лиц"
            }
        }
)
export default LEGALS

export type LegalVO = (typeof LEGALS.exampleItem)