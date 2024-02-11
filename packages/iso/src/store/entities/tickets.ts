import {Days} from '../../utils'
import SITES, {SiteVO} from "./sites";
import {AttrFactories_ex, commonAttrs, createEntitySlice, StateWithEntity} from "@shammasov/mydux"

export const statusesList = ['Новая','В работе','Выполнена','Отменена','Приостановлена']  as const

export type Status = typeof statusesList[number]

export const statusesRulesForManager = {
        'Новая': ['В работе'] as const,
        'В работе': ['Выполнена','Отменена','Приостановлена'] as const,
        "Выполнена":[],
        "Отменена":[],
        "Приостановлена":[]
} as const

export const statusesColorsMap: Record<Status, string> = {
        "В работе": 'yellow',
        "Новая": 'blue',
        "Выполнена": 'green',
        "Отменена": 'lightgrey',
        "Приостановлена": 'grey'
}

export const paymentTypesList = ['Наличные', 'Безналичные'] as const

const ticketsRaw = createEntitySlice('TICKETS',{
        ...commonAttrs,
        clientsIssueNumber: AttrFactories_ex.string({headerName:'Номер заявки', required: true, immutable: true}),
        status: AttrFactories_ex.enum({headerName: 'Статус',enum:statusesList}),
        brandId: AttrFactories_ex.itemOf({headerName: 'Заказчик',linkedEID: 'BRANDS',required: true,immutable:true}),
        legalId: AttrFactories_ex.itemOf({headerName: 'Юр. Лицо',linkedEID: 'LEGALS',required: true,immutable:true}),
        contractId: AttrFactories_ex.itemOf({headerName: 'Договор',linkedEID: 'CONTRACTS',required: true,immutable:true}),
        siteId: AttrFactories_ex.itemOf({headerName: 'Объект',linkedEID: 'SITES',required: true,immutable:true}),
        subId: AttrFactories_ex.itemOf({headerName: 'Подписка',linkedEID: 'SUBS',required: true,immutable:true, internal: true}),
        registerDate: AttrFactories_ex.date({headerName:'Зарегистрировано', internal: true}),
        workStartedDate: AttrFactories_ex.date({headerName:'Начало работ'}),
        plannedDate: AttrFactories_ex.date({headerName: 'Запланировано'}),
        completedDate: AttrFactories_ex.date({headerName: 'Дата завершения'}),
        description: AttrFactories_ex.text({headerName: 'Описание'}),
        removed: AttrFactories_ex.boolean({select: false, internal: true}),
        expensePrice: AttrFactories_ex.number({headerName: 'Расходы', internal: true}),
        expenses: AttrFactories_ex.array({
            headerName:'Список расходов',
            attributes:{
                paymentType: AttrFactories_ex.enum({enum:paymentTypesList}),
                title:AttrFactories_ex.string(),
                amount: AttrFactories_ex.number(),
                comment: AttrFactories_ex.string(),
                date: AttrFactories_ex.date({headerName: 'Дата'}),
            }
        }),
        estimations: AttrFactories_ex.array({headerName: 'Смета',
                attributes: {
                        paymentType: AttrFactories_ex.enum({enum:paymentTypesList}),
                        title:AttrFactories_ex.string(),
                        amount: AttrFactories_ex.number(),
                        comment: AttrFactories_ex.string(),
                }
        }),
            estimationPrice: AttrFactories_ex.number({headerName:'Смета сумма'}),
            workFiles: AttrFactories_ex.array({
                    attributes: {
                        url: AttrFactories_ex.string()
                    }
            }),
            actFiles: AttrFactories_ex.array({attributes: {
                        url: AttrFactories_ex.string({required: true})
                    }}),
            checkFiles: AttrFactories_ex.array({attributes: {
                        url: AttrFactories_ex.string()
                    }}),
            estimationsApproved: AttrFactories_ex.boolean({headerName: 'Смета согласована', internal: true}),
            contactInfo: AttrFactories_ex.text({headerName:'Контакты'}),
            managerUserId: AttrFactories_ex.itemOf({
                    headerName: 'Менеджер',
                    linkedEID:'USERS',
                    defaultAsPropRef:'siteId'
            }),

            techUserId: AttrFactories_ex.itemOf({
                    headerName: 'Техник',
                    linkedEID:'USERS',
                    defaultAsPropRef:'siteId'
            }),

            clientsEngineerUserId: AttrFactories_ex.itemOf({
                    headerName:'Отв. инженер',
                    linkedEID:'USERS',
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

const getIssueTitle = (issue: TicketVO) => (state: StateWithEntity<typeof ticketsRaw> & StateWithEntity<typeof SITES>) => {
    const site: SiteVO = SITES.selectors.selectById(issue.siteId)(state) as any as SiteVO
    return `${issue.clientsIssueNumber} по адресу ${site ? site.city+ site.address: ' НЕ УКАЗАН '} от ${Days.toDayString(issue.registerDate)}`
}

export const issueResource = {
        ...ticketsRaw,
    getIssueTitle,
}

export type TicketVO = typeof ticketsRaw.exampleItem
export type ExpenseItem = TicketVO['expenses'][]
export type EstimationItem = TicketVO['estimations'][number]


export const TICKETS = issueResource

export default TICKETS
