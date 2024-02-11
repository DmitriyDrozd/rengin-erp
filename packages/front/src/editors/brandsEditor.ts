import {BRANDS, buildEditor} from "iso";
import {managerUserId} from "./siteEditor";


export const brandEditor =buildEditor(BRANDS, {
    managerUserId,
})