import {createResource} from '../core/createResource'
import {valueTypes} from '../core/valueTypes'

export const CONTRACTS = createResource('contract', {
        contractNumber: valueTypes.string({headerName: 'Номер договора'}),
        brandId: valueTypes.itemOf({headerName: 'Заказчик',linkedResourceName: 'BRANDS',required: true,immutable:true}),
        legalId: valueTypes.itemOf({headerName: 'Юр. Лицо',linkedResourceName: 'LEGALS',required: true,immutable:true}),
        signDate: valueTypes.date({headerName: 'Дата подписания'}),
        endDate: valueTypes.date({headerName: 'Дата окончания'}),
        contractStatus: valueTypes.enum({headerName:'Статус договора', enum: ['Новый','Действующий','Завершён']}),
        rate: valueTypes.number({headerName: 'Ставка'}),
        managerUserId: valueTypes.itemOf({headerName: 'Менеджер', linkedResourceName:'USERS' }),
    },
    {
        langRU: {
                singular:'Договор',
                plural:'Договоры',
                some:'Договора'
        }
    }
)

export default CONTRACTS

export type ContractVO = typeof CONTRACTS.exampleItem
