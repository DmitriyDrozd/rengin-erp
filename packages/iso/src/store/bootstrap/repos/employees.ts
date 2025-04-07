import { createResource } from '../core/createResource';
import { valueTypes } from '../core/valueTypes';
import { departmentList } from '../enumsList';

export const employeeRoleEnum = {
    'техник': 'техник',
    'техник ИТ': 'техник ИТ',
    'техник Сервис': 'техник Сервис',
    'ответственный инженер': 'ответственный инженер',
    'бригадир СМР': 'бригадир СМР',
};

export const employeeSearchTypeEnum = {
    urgent: 'срочный',
    current: 'текущий'
};

export const employeeRoleTypes = [
    employeeRoleEnum['бригадир СМР'],
    employeeRoleEnum.техник,
    employeeRoleEnum['техник ИТ'],
    employeeRoleEnum['техник Сервис'],
    employeeRoleEnum['ответственный инженер'],
] as const;

export const employeeSearchTypes = [
    employeeSearchTypeEnum.urgent,
    employeeSearchTypeEnum.current,
]

export const getItemNameWithContacts = (item) => {
    const lastName = item.lastname ? `${item.lastname} ` : '';
    const name = item.name;
    // const brand = employeeRoleTypes.includes(item.role) && item.brand ? ` - ${item.brand}` : '';
    const phone = item.phone ? ` - ${item.phone}` : '';

    return `${lastName}${name}${phone}`
};

const employeesRaw = createResource('employee', {
    role: valueTypes.enum({required: true, enum: employeeRoleTypes, headerName: 'Роль'}),
    brandId: valueTypes.itemOf({
        headerName: 'Организация',
        linkedResourceName: 'BRANDS'
    }),
    name: valueTypes.string({required: true, colDef: {width: 250}, headerName: 'ФИО'},),
    title: valueTypes.string({headerName: 'Должность', colDef: {width: 200}}),
    // email: valueTypes.string({headerName: 'E-mail', toLowerCase: true, colDef: {width: 250}}),
    phone: valueTypes.string({headerName: 'Номер телефона', toLowerCase: true, colDef: {width: 250}}),
    city: valueTypes.string({headerName: 'Город'}),
    region: valueTypes.string({headerName: 'Регион'}),
    department: valueTypes.enum({ headerName: 'Отдел', enum: departmentList }),
    sourceLink: valueTypes.string({headerName: 'Ссылка на источник'}),
    timezone: valueTypes.string({headerName: 'Часовой пояс от НСК'}),
    searchType: valueTypes.enum({enum: employeeSearchTypes, headerName: 'Категория поиска'}),
    managerComment: valueTypes.text({headerName: 'Комментарий от менеджера'}),
    employeeComment: valueTypes.text({headerName: 'Комментарий от сотрудника'}),
    removed: valueTypes.boolean({select: false, colDef: false, internal: true}),
}, {
    getItemName: getItemNameWithContacts,
    langRU: {
        singular: 'Сотрудник',
        plural: 'Сотрудники',
        some: 'Сотруднка'
    }
});

export const getAbbrName = (user) => {
    const parts = user ? [user.lastname, user.name].filter(i => i !== undefined) : ['-'];

    const getPart = (index: number) => {
        const part = parts[index];
        if (index === 0) {
            return part || 'Новый сотрудник';
        }
        return (!!part && part.length) ? (' ' + part[0] + '.') : '';
    };

    return getPart(0) + getPart(1);
};

export const ROLES = ['engineer', 'worker'] as const;
export type Role = typeof ROLES[number];

export const employeesResource = {
    ...employeesRaw,
    getItemName: (item) =>
        getAbbrName(item),
    actions: {...employeesRaw.actions},
    clientsNumberProp: 'clientsEmployeeNumber',
};

export const EMPLOYEES = employeesResource;

export default employeesResource;
export type EmployeeVO = typeof employeesRaw.exampleItem
