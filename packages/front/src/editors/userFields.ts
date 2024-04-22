import { USERS } from 'iso/src/store/bootstrap';
import { PropRule } from 'iso/src/store/bootstrap/buildEditor';
import BRANDS from 'iso/src/store/bootstrap/repos/brands';
import {
    employeeRoleEnum,
    EMPLOYEES
} from 'iso/src/store/bootstrap/repos/employees';
import ISSUES from 'iso/src/store/bootstrap/repos/issues';

const brandMapper = (brands) => (item) => ({
    ...item,
    brand: brands.find(b => b.brandId === item.brandId)?.address
});

/**
 * USERS
 */
export const managerUserId:PropRule<{ managerUserId: typeof ISSUES.properties.managerUserId }, any> = {
    getParams: ({item, state}) => {
        const brands = BRANDS.selectAll(state);
        const managers = USERS.selectAll(state).filter(m => m.role==='руководитель' || m.role ==='менеджер').map(brandMapper(brands))
        return {
            options: USERS.asOptions(managers),
        }
    },
}

export const estimatorUserId: PropRule<{ estimatorUserId: typeof ISSUES.properties.estimatorUserId }, any> = {
    getParams: ({item, state}) => {
        const brands = BRANDS.selectAll(state);
        const techs = USERS.selectAll(state).filter(m => m.role==='сметчик').map(brandMapper(brands))
        return {
            options: USERS.asOptions(techs),
        }
    },
}

/**
 * EMPLOYEES
 */
export const techUserId: PropRule<{ techUserId: typeof ISSUES.properties.techUserId }, any> = {
    getParams: ({item, state}) => {
        const brands = BRANDS.selectAll(state);
        const techs = EMPLOYEES.selectAll(state).filter(m => m.role==='техник').map(brandMapper(brands));

        return {
            options: EMPLOYEES.asOptions(techs),
        }
    },
}

export const clientsEngineerUserId: PropRule<{ clientsEngineerUserId: typeof ISSUES.properties.clientsEngineerUserId}, 'clientsEngineerUserId', any> = {
    getParams: ({item, state}) => {
        const brands = BRANDS.selectAll(state);
        const engineers = EMPLOYEES.selectAll(state)
            .filter(m => m.role===employeeRoleEnum['ответственный инженер'])
            .map(brandMapper(brands));

        return {
            options: EMPLOYEES.asOptions(engineers),
        }
    },
}
