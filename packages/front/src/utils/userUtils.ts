import { departmentList } from 'iso/src/store/bootstrap/enumsList';
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

export const isCustumerHead = (user: UserVO) => {
    return isUserCustomer(user) && isDepartmentHead(user);
}
