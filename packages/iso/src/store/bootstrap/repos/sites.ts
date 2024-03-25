import {createResource} from '../core/createResource'
import {valueTypes} from '../core/valueTypes'
import {LegalVO} from './legals'


export const siteResourceRaw = createResource('site',{
        clientsSiteNumber: valueTypes.string({headerName:'Номер', required: true, immutable: true}),
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
            filterLinkedResourceItems: (list: LegalVO[], source: any) =>
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

        contactInfo: valueTypes.text({headerName:'Контакты'}),
        KPP: valueTypes.string({headerName: 'КПП'}),
        managerUserId: valueTypes.itemOf({headerName: 'Менеджер',
            linkedResourceName:'USERS',
            defaultAsPropRef:'legalId'
        }),

        techUserId: valueTypes.itemOf({headerName: 'Техник',linkedResourceName:'EMPLOYEES'}),
        clientsEngineerUserId: valueTypes.itemOf({headerName:'Отв. инженер',
            linkedResourceName:'EMPLOYEES',
            defaultAsPropRef:'legalId'
        }),
    },
    {
        getItemName: item => item?.city+', '+item?.address,
        langRU: {
            singular: 'Адрес',
            plural: 'Адреса',
            some: 'Адресов'
        }
    }
)

const siteResource = { ...siteResourceRaw, clientsNumberProp: 'clientsSiteNumber' };

export type SiteVO = (typeof siteResource)['exampleItem']

export const SITES = siteResource
export default SITES