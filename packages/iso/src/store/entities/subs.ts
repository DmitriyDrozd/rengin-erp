import {AttrFactories_ex, commonAttrs, createEntitySlice} from "@shammasov/mydux";


export const SUBS = createEntitySlice('SUBS',{
    ...commonAttrs,
        contractId: AttrFactories_ex.itemOf({headerName: 'Договор',linkedEID: 'CONTRACTS',required: true, immutable: true}),
        subscribeDate: AttrFactories_ex.date({headerName: 'Дата подключения'}),
        unsubscribeDate: AttrFactories_ex.date({headerName: 'Дата отключения'}),
        siteId: AttrFactories_ex.itemOf({headerName: 'Объект', linkedEID:'SITES', required: true}),
        rate: AttrFactories_ex.number({headerName: 'Ставка'}),
        managerUserId: AttrFactories_ex.itemOf({headerName: 'Менеджер',linkedEID: 'USERS'}),
    },
    {
        langRU: {
            singular:'Подключение',
            plural:'Подключения',
            some:'Подключений'
        }
    }
)

export default SUBS

export type SubVO = typeof SUBS.exampleItem
