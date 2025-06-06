import { departmentList } from 'iso/src/store/bootstrap/enumsList';
import { employeeCategories, EmployeeVO } from 'iso/src/store/bootstrap/repos/employees';
import {
    roleEnum,
    UserVO
} from 'iso/src/store/bootstrap/repos/users';

export const isUserCustomer = (user: UserVO) => {
    const { email } = user;

    const isRenginInternal = email.toLowerCase().includes('@rengin.ru');
    const isDeveloper = email.toLowerCase().includes('drozd.dzmitryi@gmail.com');

    return !isRenginInternal && !isDeveloper;
}

export const isDirectorRole = (user: UserVO) => {
    const { role } = user;

    return role === roleEnum['руководитель'] || isDepartmentHead(user);
}

export const isManagementRole = (user: UserVO) => {
    const { role } = user;

    return [roleEnum['руководитель'], roleEnum['менеджер']].includes(role);
}

export const isUserIT = (user: UserVO) => {
    const { department } = user;

    return department === departmentList[3]; // "ИТ"
}

export const isDepartmentHead = (user: UserVO) => {
    return user.title?.toLowerCase().includes('руководитель') || false;
}

export const isCustomerHead = (user: UserVO) => {
    return isUserCustomer(user) && isDepartmentHead(user);
}

export const isUserStaffManager = (user: UserVO) => {
    return user.role === roleEnum.staffManager;
}

/**
 * EMPLOYEES
 */

export const isEmployeeBlacklisted = (employee?: EmployeeVO) => {
    if (!employee) {
        return false;
    }

    return !employee.isPendingCategory && employee.category === employeeCategories.blacklist;
}
