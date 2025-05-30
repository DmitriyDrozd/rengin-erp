import {ISSUES, IssueVO, statusesList, statusesRulesForManager} from "iso/src/store/bootstrap/repos/issues";
import {buildEditor} from "iso/src/store/bootstrap/buildEditor";
import {
    clientsEngineerUserId,
    estimatorUserId,
    managerUserId,
    techUserId
} from './userFields';
import {optionsFromValuesList} from "../components/form/RenFormSelect";
import {Days} from "iso";
import LEGALS from "iso/src/store/bootstrap/repos/legals";
import {SITES} from "iso/src/store/bootstrap";
import BRANDS from "iso/src/store/bootstrap/repos/brands";

const countExpenses = (expenses: IssueVO['expenses']) =>
    expenses.reduce((prev, item)=> prev+(isNaN(Number(item.amount)) ? 0: Number(item.amount)), 0)


const countEstimations = (expenses: IssueVO['estimations']) =>
    expenses.reduce((prev, item)=> prev+(isNaN(Number(item.amount)) ? 0: Number(item.amount)), 0)

export const issuesEditor =  buildEditor(ISSUES,{
    clientsEngineerUserId,
    managerUserId,
    techUserId,
    estimatorUserId,
    status: {
        getParams: ({value,property,state,role,currentUserId,item}) => {
            return {
                options:optionsFromValuesList(ISSUES.properties.status.enum).map( o => {
                    if (role === 'менеджер') {
                        const availableStatuses = statusesRulesForManager[item.status];
                        o.disabled = !availableStatuses.includes(o.value);
                    }

                    // Статус выполнено не может быть проставлен пока не назначен исполнитель. 
                    if (!o.disabled && o.value === statusesList[2] && !item.techUserId) {
                        o.disabled = true;
                    }

                    return o
                })
            }
        },
        getUpdate: ({value,role,item}) => {
            if (value === 'Выполнена') {
                const completedDate = item.completedDate || Days.today();

                return {...item, completedDate, status: value}
            }

            return ({...item, status: value})
        },
    },
    estimations: {
        getUpdate: ({item,value,}) => ({
            ...item,estimationPrice: countEstimations(value), estimations: value
        })
     },
    expenses: {
        getUpdate: ({item,value,}) => ({
            ...item,expensePrice: countExpenses(value), expenses: value
        })
    },
    brandId: {
        getUpdate: ({item , value, state}) => {
            const desiredResolutionTerm = value ? BRANDS.selectById(value)(state).desiredResolutionTerm : null;
            let plannedDate = item.plannedDate;
            
            if (desiredResolutionTerm && desiredResolutionTerm > 0) {
                plannedDate = Days.today().add(desiredResolutionTerm, 'day').toDate().toISOString();
            }

            return (value !== item.brandId) ?
                {
                    ...item, 
                    siteId: undefined, 
                    legalId: undefined, 
                    contractId: undefined, 
                    subId: undefined,
                    brandId: value,
                    plannedDate,
                }
                : item
        }
    },
    legalId: {
        getUpdate: ({item , value, state}) =>{
            if (value !== item.legalId) {
                const newItem = {...item, siteId: undefined, legalId: value, contractId: undefined, subId: undefined}
                if (item.brandId === undefined){
                    newItem.brandId =  LEGALS.selectById(value)(state).brandId
                }

                return newItem

            }
            return {...item, legalId: value}
        },
        getParams: ({item, value,state}) => {
            return {
                options: LEGALS.asOptions(LEGALS.selectAll(state)
                    .filter(l => item.brandId ? l.brandId ===item.brandId : true )),
                addNewItemDefaults: {}
            }
        },

    },
    siteId: {
        getUpdate: ({item , value,state}) =>{
           const siteId = value;

            if(siteId !== undefined && siteId !== item.siteId) {
                const {sites,subs, contracts} = state.app.bootstrap;

                const site = sites.find(s => s.siteId === siteId)
                const sub = subs.find(s => s.siteId === siteId)
                const contract = sub ? contracts.find(c => c.contractId === sub.contractId) : undefined

                let newItem = {...item, siteId: siteId};

                if (!item.brandId) {
                    newItem.brandId = site.brandId
                }

                if (!item.legalId) {
                    newItem.legalId = site.legalId
                }

                if (sub && contract) {
                    newItem.contractId = contract.contractId;
                    newItem.subId = sub.subId;
                }

                if (site) {
                    newItem = {
                        ...newItem,
                        siteId: siteId,
                        contactInfo:site.contactInfo,
                        clientsEngineerUserId: site.clientsEngineerUserId,
                        managerUserId: site.managerUserId,
                        techUserId: site.techUserId,
                        estimatorUserId: site.estimatorUserId,
                    }
                }

                return newItem
            }
            return {...item, siteId}
        },
        getParams: ({item, state}) => {
            var options = SITES.selectAll(state)
            if(item.brandId) {
                options = options.filter(o => o.brandId === item.brandId)
            }
            if(item.legalId) {
                options = options.filter(o => o.legalId === item.legalId)
            }

            return {
                options : SITES.asOptions(options),
                addNewItemDefaults: {}
            }
        }
    },
})