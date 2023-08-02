import {valueTypes} from '../core/valueTypes'
import {createResource} from '../core/createResource'

export const issueResource = createResource('issue',{

        clientsIssueNumber: valueTypes.string(),
        status: valueTypes.string(),
        clientId: valueTypes.string(),

        payMode: valueTypes.string(),
        contractId: valueTypes.string(),

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