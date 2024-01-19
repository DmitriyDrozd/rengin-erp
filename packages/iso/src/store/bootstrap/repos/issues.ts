import {AnyFieldsMeta, createResource, ItemWithId, Resource} from '../core/createResource'
import {ItemOfMeta, valueTypes} from '../core/valueTypes'
import {Days} from '../../../utils/index'
import SITES, {SiteVO} from "./sites";
import {ISOState} from "../../../ISOState";
import {toAssociativeArray} from "@sha/utils";
import {USERS} from "./users";


export const statusesList = ['Новая','В работе','Выполнена','Отменена','Приостановлена']  as const

export type Status = typeof statusesList[number]

export const statusesRulesForManager: Record<Status, Status[]> = {
        'Новая': ['В работе'],
        'В работе': ['Выполнена','Отменена','Приостановлена'],
        "Выполнена":[],
        "Отменена":[],
        "Приостановлена":[]
}

export const statusesColorsMap: Record<Status, string> = {
        "В работе": 'yellow',
        "Новая": 'blue',
        "Выполнена": 'green',
        "Отменена": 'lightgrey',
        "Приостановлена": 'grey'
}

export const paymentTypesList = ['Наличные', 'Безналичные'] as const

const issuesRaw = createResource('issue',{
        clientsIssueNumber: valueTypes.string({headerName:'Номер заявки', required: true, immutable: true}),
        status: valueTypes.enum({headerName: 'Статус',enum:statusesList}),
        brandId: valueTypes.itemOf({headerName: 'Заказчик',linkedResourceName: 'BRANDS',required: true,immutable:true}),
        legalId: valueTypes.itemOf({headerName: 'Юр. Лицо',linkedResourceName: 'LEGALS',required: true,immutable:true}),
        contractId: valueTypes.itemOf({headerName: 'Договор',linkedResourceName: 'CONTRACTS',required: true,immutable:true}),
        siteId: valueTypes.itemOf({headerName: 'Объект',linkedResourceName: 'SITES',required: true,immutable:true}),
        subId: valueTypes.itemOf({headerName: 'Подписка',linkedResourceName: 'SUBS',required: true,immutable:true, internal: true}),
        registerDate: valueTypes.date({headerName:'Зарегистрировано', internal: true}),
        workStartedDate: valueTypes.date({headerName:'Начало работ'}),
        plannedDate: valueTypes.date({headerName: 'Запланировано'}),
        completedDate: valueTypes.date({headerName: 'Дата завершения'}),
        description: valueTypes.text({headerName: 'Описание'}),
        removed: valueTypes.boolean({select: false, internal: true}),
        expensePrice: valueTypes.number({headerName: 'Расходы', internal: true}),
        expenses: valueTypes.array({
            headerName:'Список расходов',
            properties:{
                paymentType: valueTypes.enum({enum:paymentTypesList}),
                title:valueTypes.string(),
                amount: valueTypes.number(),
                comment: valueTypes.string(),
                date: valueTypes.date({headerName: 'Дата'}),
            }
        }),
        estimations: valueTypes.array({headerName: 'Смета',
                properties: {
                        paymentType: valueTypes.enum({enum:paymentTypesList}),
                        title:valueTypes.string(),
                        amount: valueTypes.number(),
                        comment: valueTypes.string(),
                }
        }),
            estimationPrice: valueTypes.number({headerName:'Смета сумма'}),
            workFiles: valueTypes.array({
                    properties: {
                        url: valueTypes.string()
                    }
            }),
            actFiles: valueTypes.array({properties: {
                        url: valueTypes.string({required: true})
                    }}),
            checkFiles: valueTypes.array({properties: {
                        url: valueTypes.string()
                    }}),
            estimationsApproved: valueTypes.boolean({headerName: 'Смета согласована', internal: true}),
            contactInfo: valueTypes.text({headerName:'Контакты'}),
            managerUserId: valueTypes.itemOf({
                    headerName: 'Менеджер',
                    linkedResourceName:'USERS',
                    defaultAsPropRef:'siteId'
            }),

            techUserId: valueTypes.itemOf({
                    headerName: 'Техник',
                    linkedResourceName:'USERS',
                    defaultAsPropRef:'siteId'
            }),

            clientsEngineerUserId: valueTypes.itemOf({
                    headerName:'Отв. инженер',
                    linkedResourceName:'USERS',
                    defaultAsPropRef:'siteId'
            }),
    },

    {
            nameProp: 'clientsIssueNumber',
            langRU: {
                    singular:'Заявка',
                    plural:'Заявки',
                    some:'Заявки'
            }
    }

)

const getIssueTitle = (issue: IssueVO) => {
    const site: SiteVO = SITES.selectById(issue.siteId)(SITES.getStore().getState()) as any as SiteVO
    return `${issue.clientsIssueNumber} по адресу ${site ? site.city+ site.address: ' НЕ УКАЗАН '} от ${Days.toDayString(issue.registerDate)}`
}

export const issueResource = {
        ...issuesRaw,
    getIssueTitle,
}

export type IssueVO = typeof issuesRaw.exampleItem
export type ExpenseItem = IssueVO['expenses'][number]
export type EstimationItem = IssueVO['estimations'][number]


export const ISSUES = issueResource

export const getISSUES = () => ISSUES
const iss: Resource<any, any> = ISSUES
export default ISSUES
