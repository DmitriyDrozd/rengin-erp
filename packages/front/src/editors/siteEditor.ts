import {buildEditor, PropRule} from "iso/src/store/bootstrap/buildEditor";
import {
    employeeRoleEnum,
    EMPLOYEES
} from 'iso/src/store/bootstrap/repos/employees';
import {USERS} from "iso/src/store/bootstrap/repos/users";
import ISSUES from "iso/src/store/bootstrap/repos/issues";
import BRANDS from "iso/src/store/bootstrap/repos/brands";
import {clone} from "ramda";
import SITES from "iso/src/store/bootstrap/repos/sites";

const brandMapper = (brands) => (item) => ({
    ...item,
    brand: brands.find(b => b.brandId === item.brandId)?.address
});

export const clientsEngineerUserId: PropRule<{ clientsEngineerUserId: typeof ISSUES.properties.clientsEngineerUserId}, 'clientsEngineerUserId', any> = {
    getErrors: ({value, item, state}) => {
        const currentUser = EMPLOYEES.selectById(value)(state)
        if(currentUser) {
            const usersBrand = BRANDS.selectById(currentUser.brandId)(state)
            const currentBrand = BRANDS.selectById(item.brandId)(state)
            if (currentBrand && usersBrand && currentUser.brandId !== usersBrand.brandId)
                return 'Назначен ответственный инженер от заказчика '+usersBrand.brandName
        }
    },
    getParams: ({item, state}) => {
        const brands = BRANDS.selectAll(state);
        let engineers = EMPLOYEES
            .selectEq({role: employeeRoleEnum['ответственный инженер']})(state)
            .map(brandMapper(brands));

        if (item.brandId) {
            engineers = engineers.filter(e => e.brandId === item.brandId)
        }

        return {
            options: EMPLOYEES.asOptions(engineers),
            addNewItemDefaults: {}
        }
    },
    getUpdate: ({item, value, state}) => {
        const currentUser = EMPLOYEES.selectById(value)(state)
        const newItem = clone(item)
        if(!item.brandId && currentUser && currentUser.brandId)
            newItem.brandId = currentUser.brandId
        newItem.clientsEngineerUserId = value
        return newItem
    }
}

export const managerUserId:PropRule<{ managerUserId: typeof ISSUES.properties.managerUserId }, any> = {
    getParams: ({item, state}) => {
        const brands = BRANDS.selectAll(state);
        const managers = USERS.selectAll(state).filter(m => m.role==='руководитель' || m.role ==='менеджер').map(brandMapper(brands))
        return {
            options: USERS.asOptions(managers),
        }
    },
}

export const techUserId: PropRule<{ techUserId: typeof ISSUES.properties.techUserId }, any> = {
    getParams: ({item, state}) => {
        const brands = BRANDS.selectAll(state);
        const techs = EMPLOYEES.selectAll(state).filter(m => m.role==='техник').map(brandMapper(brands));

        return {
            options: EMPLOYEES.asOptions(techs),
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


export const siteEditor = buildEditor(SITES, {
    brandId: {
        getUpdate: ({value,item,property,state})=> {
            return {...value, brandId: value, siteId: undefined, legalId: undefined, subId: undefined}
        }
    },
    managerUserId,
    clientsEngineerUserId,
    techUserId,
    estimatorUserId,
})

