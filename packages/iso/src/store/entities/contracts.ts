import {AttrFactories_ex, commonAttrs, createEntitySlice} from "@shammasov/mydux";


export const contractStatusesList = ['Новый','Действующий','Завершён']  as const

const rawResource = createEntitySlice('CONTRACTS', {
    ...commonAttrs,
        contractNumber: AttrFactories_ex.string({headerName: 'Номер договора'}),
        brandId: AttrFactories_ex.itemOf({headerName: 'Заказчик',linkedEID: 'BRANDS',required: true,immutable:true}),
        legalId: AttrFactories_ex.itemOf({headerName: 'Юр. Лицо',linkedEID: 'LEGALS',required: true,immutable:true}),
        signDate: AttrFactories_ex.date({headerName: 'Дата подписания'}),
        endDate: AttrFactories_ex.date({headerName: 'Дата окончания'}),
        contractStatus: AttrFactories_ex.enum({headerName:'Статус договора', enum:contractStatusesList}),
        rate: AttrFactories_ex.number({headerName: 'Ставка'}),
        managerUserId: AttrFactories_ex.itemOf({headerName: 'Менеджер',
            linkedEID:'USERS',
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
}


const a: Partial<ContractVO> = {contractStatus: 'Новый'}
export default CONTRACTS
export type ContractVO = typeof CONTRACTS.exampleItem
