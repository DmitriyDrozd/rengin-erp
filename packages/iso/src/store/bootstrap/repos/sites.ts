import {createResource} from '../core/createResource'
import {valueTypes} from '../core/valueTypes'
import {RESOURCES_MAP} from '../resourcesList'
import {LegalVO} from './legals'


export const siteResource = createResource('site',{
        brandId: valueTypes.itemOf({
            headerName: 'Заказчик',
            linkedResourceName: 'BRANDS',
            required: true
        }),
        region: valueTypes.string({
            headerName: 'Регион',
            required: true
        }),
        legalId: valueTypes.itemOf({
            headerName: 'Юр. Лицо',
            linkedResourceName: 'LEGALS',
            required: true,
            filterLinkedResourceItems: (list: LegalVO[], source: SiteVO) =>
                list.filter(item => item.brandId === source.brandId)
        }),
        city: valueTypes.string({
            headerName: 'Город',
            required: true
        }),
        address: valueTypes.string({
            headerName: 'Адрес',
            required: true
        }),
        responsibleEngineer: valueTypes.string({headerName:'Ответственный инженер'}),

        KPP: valueTypes.string({headerName: 'КПП'}),
    },
    {
        langRU: {
            singular: 'Адрес',
            plural: 'Адреса',
            some: 'Адресов'
        }
    }
)


export type SiteVO = (typeof siteResource)['exampleItem']

export const SITES = siteResource


export default SITES