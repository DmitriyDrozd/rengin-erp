import {createResource} from '../core/createResource'
import {valueTypes} from '../core/valueTypes'

export const CONTRACTS = createResource('contract',{
        legalNumber: valueTypes.string({headerName: 'Номер договора'}),
        legalId: valueTypes.string({headerName: 'Юр. Лицо'}),
        startDate: valueTypes.date({headerName: 'Заключение договора'}),
        endDate: valueTypes.date({headerName: 'Окончание договора'}),
        rate: valueTypes.number({headerName: 'Ставка'}),
        sites: valueTypes.arrayOf({headerName:'Адреса',res: 'SITES'}),
        managerUserId: valueTypes.itemOf({headerName: 'Менеджер'}),
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
