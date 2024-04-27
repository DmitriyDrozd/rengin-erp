import {buildEditor} from "iso/src/store/bootstrap/buildEditor";
import {
    estimatorUserId,
    managerUserId,
} from './userFields';
import LEGALS from "iso/src/store/bootstrap/repos/legals";
import { EXPENSES } from 'iso/src/store/bootstrap';

export const expensesEditor =  buildEditor(EXPENSES,{
    managerUserId,
    estimatorUserId,
    brandId: {
        getUpdate: ({item , value, state}) => {
            const {brands} = state.app.bootstrap;
            const brandId = item.brandId;
            const brand = brands.find(b => b.brandId === brandId);

            const newItem = { ...item };

            if (item.managerUserId === undefined && brand && brand.managerUserId) {
                newItem.managerUserId = brand.managerUserId
            }

            return (value !== item.brandId) ?
                {...newItem, siteId: undefined, legalId: undefined, contractId: undefined, subId: undefined, brandId: value}
                : newItem
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
})