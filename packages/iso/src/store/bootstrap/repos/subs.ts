import dayjs from 'dayjs';
import {createResource} from '../core/createResource'
import {valueTypes} from '../core/valueTypes'
import {
    roleEnum,
    UserVO
} from './users';

export const SUBS_RAW = createResource('sub',{
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
        getItemName: (item) => `Подключение от ${item?.subscribeDate ? dayjs(item.subscribeDate).format('YYYY/MM/DD') : 'неизвестной даты'}`,
        langRU: {
            singular:'Подключение',
            plural:'Подключения',
            some:'Подключений'
        }
    }
)

export const SUBS = {
    ...SUBS_RAW,
    clientsNumberProp: 'clientsSubNumber',
}

export default SUBS

export type SubVO = typeof SUBS.exampleItem
