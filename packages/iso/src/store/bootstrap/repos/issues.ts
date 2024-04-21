import { Dayjs } from 'dayjs';
import { createResource } from '../core/createResource';
import { valueTypes } from '../core/valueTypes';
import { Days } from '../../../utils';
import {
    employeeRoleEnum,
    EmployeeVO
} from './employees';
import SITES, { SiteVO } from './sites';
import {
    roleEnum,
    UserVO
} from './users';


export const statusesList = ['Новая', 'В работе', 'Выполнена', 'Отменена', 'Приостановлена'] as const;
export const estimationStatusesList = ['Новая', 'На согласовании', 'Согласована', 'Выставлена в оплату', 'Отклонена'] as const;

export type Status = typeof statusesList[number]
export type EstimationStatus = typeof estimationStatusesList[number]

export const statusesRulesForManager: Record<Status, Status[]> = {
    'Новая': ['В работе'],
    'В работе': ['Выполнена', 'Отменена', 'Приостановлена'],
    'Выполнена': [],
    'Отменена': [],
    'Приостановлена': []
};

export const statusesColorsMap: Record<Status, string> = {
    'В работе': 'yellow',
    'Новая': 'blue',
    'Выполнена': 'green',
    'Отменена': 'lightgrey',
    'Приостановлена': 'grey'
};

export const estimationStatuses: Record<EstimationStatus, string> = {
    'Новая': 'Новая',
    'На согласовании': 'На согласовании',
    'Согласована': 'Согласована',
    'Выставлена в оплату': 'Выставлена в оплату',
    'Отклонена': 'Отклонена'
};

export const estimationsStatusesRulesForManager: Record<EstimationStatus, EstimationStatus[]> = {
    'Новая': ['На согласовании'],
    'На согласовании': ['Согласована', 'Отклонена'],
    'Согласована': ['Выставлена в оплату'],
    'Выставлена в оплату': ['Отклонена'],
    'Отклонена': ['Новая', 'На согласовании']
};

export const paymentTypes = {
    cash: 'Наличные',
    cashless: 'Безналичные',
}
export const paymentTypesList = [paymentTypes.cash, paymentTypes.cashless] as const;

const issuesRaw = createResource('issue', {
        clientsIssueNumber: valueTypes.string({headerName: 'Номер заявки', required: true, unique: true}),
        status: valueTypes.enum({headerName: 'Статус', enum: statusesList}),
        brandId: valueTypes.itemOf({headerName: 'Заказчик', linkedResourceName: 'BRANDS', required: true, immutable: true}),
        legalId: valueTypes.itemOf({headerName: 'Юр. Лицо', linkedResourceName: 'LEGALS', required: true, immutable: true}),
        contractId: valueTypes.itemOf({
            headerName: 'Договор',
            linkedResourceName: 'CONTRACTS',
            required: true,
            immutable: true
        }),
        siteId: valueTypes.itemOf({headerName: 'Объект', linkedResourceName: 'SITES', required: true, immutable: true}),
        subId: valueTypes.itemOf({
            headerName: 'Подписка',
            linkedResourceName: 'SUBS',
            required: true,
            immutable: true,
            internal: true
        }),
        registerDate: valueTypes.date({headerName: 'Зарегистрировано'}),
        workStartedDate: valueTypes.date({headerName: 'Начало работ'}),
        plannedDate: valueTypes.date({headerName: 'Запланировано'}),
        completedDate: valueTypes.date({headerName: 'Дата завершения'}),
        description: valueTypes.text({headerName: 'Описание'}),
        removed: valueTypes.boolean({select: false, internal: true}),
        expensePrice: valueTypes.number({headerName: 'Расходы', internal: true}),
        expenses: valueTypes.array({
            headerName: 'Список расходов',
            properties: {
                paymentType: valueTypes.enum({enum: paymentTypesList}),
                title: valueTypes.string(),
                amount: valueTypes.number(),
                comment: valueTypes.string(),
                date: valueTypes.date({headerName: 'Дата'}),
            }
        }),
        estimations: valueTypes.array({
            headerName: 'Смета',
            properties: {
                paymentType: valueTypes.enum({enum: paymentTypesList}),
                title: valueTypes.string(),
                amount: valueTypes.number(),
                comment: valueTypes.string(),
            }
        }),
        estimationPrice: valueTypes.number({headerName: 'Смета сумма'}),
        workFiles: valueTypes.array({
            properties: {
                url: valueTypes.string()
            }
        }),
        actFiles: valueTypes.array({
            properties: {
                url: valueTypes.string({required: true})
            }
        }),
        checkFiles: valueTypes.array({
            properties: {
                url: valueTypes.string()
            }
        }),
        estimationsStatus: valueTypes.enum({headerName: 'Статус сметы', internal: true, enum: estimationStatusesList}),
        contactInfo: valueTypes.text({headerName: 'Комментарии'}),
        managerUserId: valueTypes.itemOf({
            headerName: 'Менеджер',
            linkedResourceName: 'USERS',
            defaultAsPropRef: 'siteId',
            filterLinkedResourceItems: (list: UserVO[]) => list.filter(item => item.role === roleEnum['менеджер']),
        }),
        techUserId: valueTypes.itemOf({
            headerName: 'Техник',
            linkedResourceName: 'EMPLOYEES',
            defaultAsPropRef: 'siteId',
            filterLinkedResourceItems: (list: EmployeeVO[]) => list.filter(item => item.role === employeeRoleEnum['техник']),
        }),
        clientsEngineerUserId: valueTypes.itemOf({
            headerName: 'Отв. инженер',
            linkedResourceName: 'EMPLOYEES',
            defaultAsPropRef: 'siteId',
            filterLinkedResourceItems: (list: EmployeeVO[]) => list.filter(item => item.role === employeeRoleEnum['ответственный инженер']),
        }),
        estimatorUserId: valueTypes.itemOf({
            headerName: 'Сметчик',
            linkedResourceName: 'USERS',
            defaultAsPropRef: 'siteId',
            filterLinkedResourceItems: (list: UserVO[]) => list.filter(item => item.role === roleEnum['сметчик']),
        }),
    },

    {
        nameProp: 'clientsIssueNumber',
        langRU: {
            singular: 'Заявка',
            plural: 'Заявки',
            some: 'Заявки'
        }
    }
);

const getIssueTitle = (issue: IssueVO) => {
    const site: SiteVO = SITES.selectById(issue.siteId)(SITES.getStore().getState()) as any as SiteVO;
    return `${issue.clientsIssueNumber} по адресу ${site ? site.city + ' ' + site.address : ' НЕ УКАЗАН '} от ${Days.toDayString(issue.registerDate)}`;
};

export const issueResource = {
    ...issuesRaw,
    getIssueTitle,
    clientsNumberProp: 'clientsIssueNumber',
    rolesProps: ['managerUserId', 'techUserId', 'clientsEngineerUserId', 'estimatorUserId'],
};

export type IssueVO = typeof issuesRaw.exampleItem
export type ExpenseItem = IssueVO['expenses'][number]

export const ISSUES = issueResource;

export default ISSUES;
