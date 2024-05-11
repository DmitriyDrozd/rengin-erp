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

export const estimationStatusesList = [
    'Новая',
    'На согласовании',
    'Согласована',
    'Выставлена в оплату',
    'Оплачена',
    'Не оплачена'
] as const;

export type EstimationStatus = typeof estimationStatusesList[number]

export const estimationsStatusesRulesForManager: {
    'Новая': string[];
    'Выставлена в оплату': (string)[];
    'Согласована': string[];
    'На согласовании': string[]
} = {
    'Новая': ['На согласовании'],
    'На согласовании': ['Согласована'],
    'Согласована': ['Выставлена в оплату'],
    'Выставлена в оплату': ['Оплачена', 'Не оплачена'],
};

export const estimationsStatusesColorsMap: Record<EstimationStatus, string> = {
    'Новая': 'green',
    'На согласовании': 'yellow',
    'Согласована': 'blue',
    'Выставлена в оплату': 'orange',
    'Оплачена': 'darkgreen',
    'Не оплачена': 'red',
};

const expensesRaw = createResource('expense', {
        clientsExpenseNumber: valueTypes.string({headerName: 'Номер сметы', required: true, unique: true}),

        brandId: valueTypes.itemOf({headerName: 'Заказчик', linkedResourceName: 'BRANDS', required: true}),
        legalId: valueTypes.itemOf({headerName: 'Юр. Лицо', linkedResourceName: 'LEGALS', required: true}),

        dateFR: valueTypes.date({ headerName: 'Месяц и год ФР' }),

        expensePrice: valueTypes.number({headerName: 'Сумма предварительная'}),
        expensePriceFinal: valueTypes.number({ headerName: 'Сумма итоговая' }),

        expenseFiles: valueTypes.array({
            properties: {
                url: valueTypes.string()
            }
        }),
        estimationsStatus: valueTypes.enum({headerName: 'Статус сметы', internal: true, enum: estimationStatusesList}),

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
            singular: 'Итоговая смета',
            plural: 'Итоговые сметы',
            some: 'Итоговых смет'
        }
    }
);

const getExpenseTitle = (expense: ExpenseVO) => {
    const brand: BrandVO = BRANDS.selectById(expense.brandId)(BRANDS.getStore().getState()) as any as BrandVO;
    return `Смета ${expense.clientsExpenseNumber} для заказчика ${brand ? brand.brandName : 'НЕ УКАЗАН'}`;
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
