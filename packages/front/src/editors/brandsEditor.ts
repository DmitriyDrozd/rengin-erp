import {buildEditor, PropRule} from "iso/src/store/bootstrap/buildEditor";
import {USERS} from "iso/src/store/bootstrap/repos/users";
import ISSUES from "iso/src/store/bootstrap/repos/issues";
import BRANDS from "iso/src/store/bootstrap/repos/brands";
import {clone} from "ramda";
import SITES from "iso/src/store/bootstrap/repos/sites";
import {managerUserId} from "./siteEditor";





export const brandEditor =buildEditor(BRANDS, {
    managerUserId,
})