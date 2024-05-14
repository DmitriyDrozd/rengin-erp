import {createResource} from '../core/createResource'
import {valueTypes} from '../core/valueTypes'

export const contractStatusesList = ['Новый','Действующий','Завершён']  as const

const rawResource = createResource('contract', {
        contractNumber: valueTypes.string({headerName: 'Номер договора'}),
        brandId: valueTypes.itemOf({headerName: 'Заказчик',linkedResourceName: 'BRANDS',required: true,immutable:true}),
        legalId: valueTypes.itemOf({headerName: 'Юр. Лицо',linkedResourceName: 'LEGALS',required: true,immutable:true}),
        signDate: valueTypes.date({headerName: 'Дата подписания'}),
        endDate: valueTypes.date({headerName: 'Дата окончания'}),
        contractStatus: valueTypes.enum({headerName:'Статус договора', enum: contractStatusesList}),
        rate: valueTypes.number({headerName: 'Ставка'}),
        managerUserId: valueTypes.itemOf({headerName: 'Менеджер',
            linkedResourceName:'USERS',
            defaultAsPropRef:'legalId'
        }),
    },
    {
        langRU: {
                singular:'Договор',
                plural:'Договоры',
                some:'Договора'
        }
    }
)


export const CONTRACTS = {
    ...rawResource,
    clientsNumberProp: 'clientsContractNumber',
}


const a: Partial<ContractVO> = {contractStatus: 'Новый'}
export default CONTRACTS
export type ContractVO = typeof CONTRACTS.exampleItem
