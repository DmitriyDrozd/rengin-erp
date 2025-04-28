import {buildEditor} from "iso/src/store/bootstrap/buildEditor";
import {EMPLOYEES} from "iso/src/store/bootstrap";
import { specialization } from "./workTypesFields";

export const employeesditor = buildEditor(EMPLOYEES, {
    specialization,
})