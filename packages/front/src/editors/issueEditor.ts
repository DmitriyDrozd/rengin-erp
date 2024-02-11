import {buildEditor, Days, LEGALS, optionsFromValuesList, SITES, statusesRulesForManager, TICKETS, TicketVO} from "iso"
import {clientsEngineerUserId, managerUserId, techUserId} from "./siteEditor";


const countExpenses = (expenses: TicketVO['expenses']) =>
    expenses.reduce((prev, item)=> prev+(isNaN(Number(item.amount)) ? 0: Number(item.amount)), 0)


const countEstimations = (expenses: TicketVO['estimations']) =>
    expenses.reduce((prev, item)=> prev+(isNaN(Number(item.amount)) ? 0: Number(item.amount)), 0)

export const issuesEditor =  buildEditor(TICKETS,{
    clientsEngineerUserId,
    managerUserId,
    techUserId,
    status: {
        getParams: ({value,property,state,role,currentUserId,item}) => {
            return {
                options:optionsFromValuesList(TICKETS.attributes.status.enum).map(o => {
                    if(role === 'менеджер') {
                        const availableStatuses  = statusesRulesForManager[item.status]
                        o.disabled = !availableStatuses.includes(o.value)
                    }
                    return o
                })
            }
        },
        getUpdate: ({value,role,item}) => {
            if(value === 'В работе') {
                return ({...item,'workStartedDate': Days.today(), status: value})
            } else if(value === 'Выполнена') {
                return {...item,'completedDate': Days.today(), status: value}
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
        getUpdate: ({item , value}) =>{
            return (value !== item.brandId) ?
                {...item, siteId: undefined, legalId: undefined, contractId: undefined, subId: undefined, brandId: value}
                : item
        }
    },
    legalId: {
        getUpdate: ({item , value, state}) =>{
            if (value !== item.legalId) {
                const newItem = {...item, siteId: undefined, legalId: value, contractId: undefined, subId: undefined}
                if (item.brandId === undefined){
                    newItem.brandId =  LEGALS.selectors.selectById(value)(state).brandId
                }


                return newItem

            }
            return {...item, legalId: value}
        },
        getParams: ({item, value,state}) => {
            return {
                options: LEGALS.asOptions(LEGALS.selectors.selectAll(state)
                    .filter(l => item.brandId ? l.brandId ===item.brandId : true )),
                addNewItemDefaults: {}
            }
        },

    },
    siteId: {
        getUpdate: ({item , value,state}) =>{
           const siteId =value
            if(siteId !== undefined && siteId !== item.siteId) {
                    const {sites,subs, contracts} = state.app.bootstrap
                    const site = sites.find(s => s.siteId === siteId)

                    const sub = subs.find(s => s.siteId === siteId)
                    const contract = sub ? contracts.find(c => c.contractId === sub.contractId) : undefined
                let newItem = {...item, siteId: siteId}
                if(!item.brandId)
                    newItem.brandId = site.brandId
                if(!item.legalId)
                    newItem.legalId = site.legalId
                if(sub && contract && site) {
                    newItem = {...newItem, contractId: contract.contractId, siteId: siteId, subId: sub.subId,contactInfo:site.contactInfo, clientsEngineerUserId: site.clientsEngineerUserId }
                }

                if(item.clientsEngineerUserId === undefined && site && site.clientsEngineerUserId) {
                    newItem.clientsEngineerUserId = site.clientsEngineerUserId
                }if(item.managerUserId === undefined && site && site.managerUserId) {
                    newItem.managerUserId = site.managerUserId
                }if(item.techUserId === undefined && site && site.techUserId) {
                    newItem.techUserId = site.techUserId
                }

                return newItem
            }
            return {...item, siteId}
        },
        getParams: ({item, state}) => {
            var options = SITES.selectors.selectAll(state)
            if(item.brandId) {
                options = options.filter(o => o.brandId === item.brandId)
            }
            if(item.legalId) {
                options = options.filter(o => o.legalId === item.legalId)
            }
            console.log('options', options)
            return {
                options : SITES.asOptions(options),
                addNewItemDefaults: {}
            }
        }
    },
})