import {createResource} from '../core/createResource'
import {valueTypes} from '../core/valueTypes'
import {LegalVO} from './legals'


export const siteResource = createResource('site',{
        brandId: valueTypes.itemOf({
            headerName: 'Заказчик',
            linkedResourceName: 'BRANDS',
            required: true
        }),
       /* region: valueTypes.string({
            headerName: 'Регион',
            required: true
        }),*/
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
        responsibleManager: valueTypes.string({headerName:'Ответственный менеджер'}),
        contactInfo: valueTypes.text({headerName:'Контакты'}),
        KPP: valueTypes.string({headerName: 'КПП'}),
    },
    {
        getItemName: item => item.city+', '+item.address,
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