import dayjs from 'dayjs';
import {createResource} from '../core/createResource'
import {valueTypes} from '../core/valueTypes'
import {
    roleEnum,
    UserVO
} from './users';

export const SUBS = createResource('sub',{
        contractId: valueTypes.itemOf({headerName: 'Договор',linkedResourceName: 'CONTRACTS',required: true, immutable: true}),
        subscribeDate: valueTypes.date({headerName: 'Дата подключения'}),
        unsubscribeDate: valueTypes.date({headerName: 'Дата отключения'}),
        siteId: valueTypes.itemOf({headerName: 'Объект', linkedResourceName:'SITES', required: true}),
        rate: valueTypes.number({headerName: 'Ставка'}),
        managerUserId: valueTypes.itemOf({
            headerName: 'Менеджер',
            linkedResourceName: 'USERS',
            filterLinkedResourceItems: (list: UserVO[]) => list.filter(item => item.role === roleEnum['менеджер']),
        }),
    },
    {
        getItemName: (item) => `Подключение от ${dayjs(item.subscribeDate).format('YYYY/MM/DD')}`,
        langRU: {
            singular:'Подключение',
            plural:'Подключения',
            some:'Подключений'
        }
    }
)

export default SUBS

export type SubVO = typeof SUBS.exampleItem
