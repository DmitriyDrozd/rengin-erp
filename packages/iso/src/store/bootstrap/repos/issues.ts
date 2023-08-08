import {valueTypes} from '../core/valueTypes'
import {createResource} from '../core/createResource'

export const issueResource = createResource('issue',{

        clientsIssueNumber: valueTypes.string(),
        status: valueTypes.string(),
            brandId: valueTypes.itemOf({headerName: 'Заказчик',linkedResourceName: 'BRANDS',required: true,immutable:true}),
            legalId: valueTypes.itemOf({headerName: 'Юр. Лицо',linkedResourceName: 'LEGALS',required: true,immutable:true}),
            contractId: valueTypes.itemOf({headerName: 'Договор',linkedResourceName: 'CONTRACTS',required: true,immutable:true}),
            siteId: valueTypes.itemOf({headerName: 'Объект',linkedResourceName: 'SITES',required: true,immutable:true}),

            subId: valueTypes.itemOf({headerName: 'Подписка',linkedResourceName: 'CONTRACTS',required: true,immutable:true}),

            payMode: valueTypes.string(),


        userId: valueTypes.string(),
        responsibleEngineer: valueTypes.string(),

        registerDate: valueTypes.date(),
        workStartedDate: valueTypes.date(),
        plannedDate: valueTypes.date(),
        completedDate: valueTypes.date(),

        description: valueTypes.string(),
        removed: valueTypes.boolean({select: false}),
    },
    {
            langRU: {
                    singular:'Заявка',
                    plural:'Заявки',
                    some:'Заявки'
            }
    }
)

export type IssueVO = typeof issueResource.exampleItem



export const ISSUES = issueResource

export default ISSUES