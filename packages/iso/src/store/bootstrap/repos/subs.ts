import {createResource} from '../core/createResource'
import {valueTypes} from '../core/valueTypes'

export const SUBS = createResource('sub',{
        contractId: valueTypes.itemOf({headerName: 'Договор',linkedResourceName: 'CONTRACTS',required: true, immutable: true}),
        subscribeDate: valueTypes.date({headerName: 'Дата подключения'}),
        unsubscribeDate: valueTypes.date({headerName: 'Дата отключения'}),
        siteId: valueTypes.itemOf({headerName: 'Объект', linkedResourceName:'SITES', required: true}),
        rate: valueTypes.number({headerName: 'Ставка'}),
        managerUserId: valueTypes.itemOf({headerName: 'Менеджер',linkedResourceName: 'USERS'}),
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
