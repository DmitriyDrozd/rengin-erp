import {buildEditor} from "iso/src/store/bootstrap/buildEditor";
import BRANDS from "iso/src/store/bootstrap/repos/brands";
import {managerUserId} from "./userFields";


export const brandEditor = buildEditor(BRANDS, {
    managerUserId,
})