import { createResource } from '../core/createResource';
import { valueTypes } from '../core/valueTypes';
import {
    BRANDS,
    BrandVO
} from './brands';
import {
    roleEnum,
    UserVO
} from './users';


export const expensesStatusesList = [
    'На согласовании',
    'Согласована',
    'Выставлена в оплату',
    'Оплачена',
    'Не оплачена'
] as const;

export type ExpenseStatus = typeof expensesStatusesList[number]

export const expensesStatuses: Record<ExpenseStatus, string> = {
    [expensesStatusesList['На согласовании']]: 'На согласовании',
    [expensesStatusesList['Согласована']]: 'Согласована',
    [expensesStatusesList['Выставлена в оплату']]: 'Выставлена в оплату',
    [expensesStatusesList['Оплачена']]: 'Оплачена',
    [expensesStatusesList['Не оплачена']]: 'Не оплачена'
};

export const expensesStatusesRulesForManager: Record<ExpenseStatus, ExpenseStatus[]> = {
    'На согласовании': ['Согласована'],
    'Согласована': ['Выставлена в оплату'],
    'Выставлена в оплату': ['Оплачена', 'Не оплачена'],
};

const expensesRaw = createResource('expense', {
        clientsExpenseNumber: valueTypes.string({headerName: 'Номер сметы', required: true, unique: true}),

        brandId: valueTypes.itemOf({headerName: 'Заказчик', linkedResourceName: 'BRANDS', required: true, immutable: true}),
        legalId: valueTypes.itemOf({headerName: 'Юр. Лицо', linkedResourceName: 'LEGALS', required: true, immutable: true}),
        siteId: valueTypes.itemOf({headerName: 'Объект', linkedResourceName: 'SITES', required: true, immutable: true}),

        expensePrice: valueTypes.number({headerName: 'Смета сумма'}),
        expenseFiles: valueTypes.array({
            properties: {
                url: valueTypes.string()
            }
        }),
        estimationsStatus: valueTypes.enum({headerName: 'Статус сметы', internal: true, enum: expensesStatusesList}),

        managerUserId: valueTypes.itemOf({
            headerName: 'Менеджер',
            linkedResourceName: 'USERS',
            defaultAsPropRef: 'siteId',
            filterLinkedResourceItems: (list: UserVO[]) => list.filter(item => item.role === roleEnum['менеджер']),
        }),
        estimatorUserId: valueTypes.itemOf({
            headerName: 'Сметчик',
            linkedResourceName: 'USERS',
            defaultAsPropRef: 'siteId',
            filterLinkedResourceItems: (list: UserVO[]) => list.filter(item => item.role === roleEnum['сметчик']),
        }),
        removed: valueTypes.boolean({select: false, internal: true}),
    },

    {
        nameProp: 'clientsExpenseNumber',
        langRU: {
            singular: 'Смета',
            plural: 'Сметы',
            some: 'Смет'
        }
    }
);

const getExpenseTitle = (expense: ExpenseVO) => {
    const brand: BrandVO = BRANDS.selectById(expense.brandId)(BRANDS.getStore().getState()) as any as BrandVO;
    return `Смета ${expense.clientsExpenseNumber} для заказчика ${brand ? brand.brandName : 'НЕ УКАЗАН'}}`;
};

export const issueResource = {
    ...expensesRaw,
    getIssueTitle: getExpenseTitle,
    clientsNumberProp: 'clientsExpenseNumber',
    rolesProps: ['managerUserId', 'estimatorUserId'],
};

export type ExpenseVO = typeof expensesRaw.exampleItem
export const EXPENSES = issueResource;

export default EXPENSES;
