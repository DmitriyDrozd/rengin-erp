import {LegalVO} from './legals'
import {AttrFactories_ex, commonAttrs, createEntitySlice} from "@shammasov/mydux";


export const siteResource = createEntitySlice('SITES',{
    ...commonAttrs,
        brandId: AttrFactories_ex.itemOf({
            headerName: 'Заказчик',
            linkedEID: 'BRANDS',
            required: true
        }),
       /* region: AttrFactories_ex.string({
            headerName: 'Регион',
            required: true
        }),*/
        legalId: AttrFactories_ex.itemOf({
            headerName: 'Юр. Лицо',
            linkedEID: 'LEGALS',
            required: true,
            filterLinkedResourceItems: (list: LegalVO[], source: any) =>
                list.filter(item => item.brandId === source.brandId)
        }),
        city: AttrFactories_ex.string({
            headerName: 'Город',
            required: true
        }),
        address: AttrFactories_ex.string({
            headerName: 'Адрес',
            required: true
        }),

        contactInfo: AttrFactories_ex.text({headerName:'Контакты'}),
        KPP: AttrFactories_ex.string({headerName: 'КПП'}),


        managerUserId: AttrFactories_ex.itemOf({headerName: 'Менеджер',
            linkedEID:'USERS',
            defaultAsPropRef:'legalId'
        }),
        techUserId: AttrFactories_ex.itemOf({headerName: 'Техник',linkedEID:'USERS'}),

        clientsEngineerUserId: AttrFactories_ex.itemOf({headerName:'Отв. инженер',
            linkedEID:'USERS',
            defaultAsPropRef:'legalId'
        }),

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