import { DefaultOptionType } from "antd/es/select";
import { IssueVO } from "iso/src/store/bootstrap/repos/issues";

export const TYPES = {
    department: 'department',
    manager: 'manager',
    tech: 'tech',
    brand: 'brand',
};

export const typeOptions: DefaultOptionType[] = [
    {
        label: 'Отдел',
        value: TYPES.department
    },
    {
        label: 'Менеджер',
        value: TYPES.manager
    },
    {
        label: 'Техник',
        value: TYPES.tech
    },
    {
        label: 'Заказчик',
        value: TYPES.brand,
    }
];

export const DEPS = {
    build: 'строительный',
    estimator: 'сметный',
    service: 'сервисный',
    IT: 'ИТ',
};

export const departmentOptions = [
    {value: DEPS.build, label: 'строительный'},
    {value: DEPS.estimator, label: 'сметный'},
    {value: DEPS.service, label: 'сервисный'},
    {value: DEPS.IT, label: 'ИТ'},
];

export const techFilter = (techId: string) => (issue: IssueVO) => issue.techUserId === techId;
export const managerFilter = (managerId: string) => (issue: IssueVO) => issue.managerUserId === managerId;
export const departmentFilter = (department: string, ledger: any) => (issue: IssueVO) => {
    const isManagerInDep = ledger.users.byId[issue.managerUserId]?.department === department;
    const isEstimatorInDep = ledger.users.byId[issue.estimatorUserId]?.department === department;

    return isManagerInDep || isEstimatorInDep;
};
export const brandFilter = (brandId: string) => (issue: IssueVO) => issue.brandId === brandId;

export const SUBJ_FILTER = {
    [TYPES.tech]: techFilter,
    [TYPES.manager]: managerFilter,
    [TYPES.department]: departmentFilter,
    [TYPES.brand]: brandFilter,
};
