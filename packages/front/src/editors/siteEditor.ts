import {BRANDS, buildEditor, PropRule, SITES, TICKETS, USERS} from "iso";
import {clone} from "ramda";

export const clientsEngineerUserId: PropRule<{ clientsEngineerUserId: typeof TICKETS.attributes.clientsEngineerUserId}, 'clientsEngineerUserId', any> = {
    getErrors: ({value, item, state}) => {
        const currentUser = USERS.selectors.selectById(value)(state)
        if(currentUser) {
            const usersBrand = BRANDS.selectors.selectById(currentUser.brandId)(state)
            const currentBrand = BRANDS.selectors.selectById(item.id)(state)
            if (currentBrand && usersBrand && currentUser.brandId !== usersBrand.id)
                return 'Назначен ответственный инженер от заказчика '+usersBrand.brandName
        }
    },
    getParams: ({item, state}) => {
        var engeneers = USERS.selectors.selectEq({role: 'ответственный инженер'})(state)
        if(item.brandId)
            engeneers = engeneers.filter(e => e.brandId === item.brandId)
        return {
            options: USERS.asOptions(engeneers),
            addNewItemDefaults: {}
        }
    },
    getUpdate: ({item, value, state}) => {
        const currentUser = USERS.selectors.selectById(value)(state)
        const newItem = clone(item)
        if(!item.brandId && currentUser && currentUser.brandId)
            newItem.brandId = currentUser.brandId
        newItem.clientsEngineerUserId = value
        return newItem
    }
}

export const managerUserId:PropRule<{ managerUserId: typeof TICKETS.attributes.managerUserId }, any> = {
    getParams: ({item, state}) => {
        var managers = USERS.selectors.selectAll(state).filter(m => m.role==='руководитель' || m.role ==='менеджер')
        return {
            options: USERS.asOptions(managers),
        }
    },
}

export const techUserId: PropRule<{ techUserId: typeof TICKETS.attributes.techUserId }, any> = {
    getParams: ({item, state}) => {
        var managers = USERS.selectors.selectAll(state).filter(m => m.role==='техник')
        return {
            options: USERS.asOptions(managers),
        }
    },
}


export const siteEditor = buildEditor(SITES, {
    brandId: {
        getUpdate: ({value,item,property,state})=> {
            return {...value, brandId: value, siteId: undefined, legalId: undefined, subId: undefined}
        }
    },
    managerUserId: managerUserId,
    clientsEngineerUserId: clientsEngineerUserId,
    techUserId: techUserId,



})

