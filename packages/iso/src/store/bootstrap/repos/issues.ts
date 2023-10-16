import {valueTypes} from '../core/valueTypes'
import {createResource} from '../core/createResource'

export type ExpenseItem = {
        paymentType: string
        title: string
        amount: number
        comment: string
        date: any
}

export type EstimationItem = {
        paymentType: string
        title: string
        amount: number
        comment: string
}

const issuesRaw = createResource('issue',{
        clientsIssueNumber: valueTypes.string({headerName:'Номер заявки', required: true, immutable: true}),
        status: valueTypes.enum({headerName: 'Статус',enum:['Новая','В работе','Выполнена','Отменена','Приостановлена']}),
        phase: valueTypes.string({headerName: 'Этап'}),
        brandId: valueTypes.itemOf({headerName: 'Заказчик',linkedResourceName: 'BRANDS',required: true,immutable:true}),
        legalId: valueTypes.itemOf({headerName: 'Юр. Лицо',linkedResourceName: 'LEGALS',required: true,immutable:true}),
        contractId: valueTypes.itemOf({headerName: 'Договор',linkedResourceName: 'CONTRACTS',required: true,immutable:true}),
        siteId: valueTypes.itemOf({headerName: 'Объект',linkedResourceName: 'SITES',required: true,immutable:true}),
        subId: valueTypes.itemOf({headerName: 'Подписка',linkedResourceName: 'CONTRACTS',required: true,immutable:true}),
        payMode: valueTypes.string({headerName: 'Оплата'}),
        userId: valueTypes.string(),
        customersEngineer: valueTypes.string({headerName: 'Инженер заказчика'}),
        responsibleEngineer: valueTypes.string({headerName: 'Ответственный инженер'}),
        responsibleManagerId: valueTypes.itemOf({headerName: 'Ответственный менеджер', linkedResourceName:'USERS'}),
        registerDate: valueTypes.date({headerName:'Зарегистрировано'}),
        workStartedDate: valueTypes.date({headerName:'Начало работ'}),
        plannedDate: valueTypes.date({headerName: 'Запланировано'}),
        completedDate: valueTypes.date({headerName: 'Дата завершения'}),
        description: valueTypes.string({headerName: 'Описание'}),
        removed: valueTypes.boolean({select: false}),
        expensePrice: valueTypes.number({headerName: 'Расходы'}),
        expenses: valueTypes.array({headerName:'Список расходов'}),
        estimations: valueTypes.array({headerName: 'Смета'}),
        estimationPrice: valueTypes.number({headerName:'Смета сумма'}),
        workFiles: valueTypes.array({}),
        actFiles: valueTypes.array({}),
        checkFiles: valueTypes.array({}),
        estimationsApproved: valueTypes.boolean({headerName: 'Смета согласована'}),
        contactInfo: valueTypes.text({headerName:'Контакты'}),
    },
    {
            indexes:['brandId','contractId','legalId','siteId','subId','userId'],
            langRU: {
                    singular:'Заявка',
                    plural:'Заявки',
                    some:'Заявки'
            }
    }
)

export const issueResource = {
        ...issuesRaw,
}

export type IssueVO = typeof issueResource.exampleItem


export const ISSUES = issueResource
