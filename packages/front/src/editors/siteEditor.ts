import {buildEditor} from "iso/src/store/bootstrap/buildEditor";
import SITES from "iso/src/store/bootstrap/repos/sites";
import {
    clientsEngineerUserId,
    estimatorUserId,
    managerUserId,
    techUserId
} from './userFields';


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

