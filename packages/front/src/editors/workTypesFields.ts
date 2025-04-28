import { EMPLOYEES, LIST_WORK_TYPES } from "iso/src/store/bootstrap";
import { PropRule } from "iso/src/store/bootstrap/buildEditor";

export const specialization: PropRule<{ specialization: typeof EMPLOYEES.properties.specialization }, any> = {
    getParams: ({state}) => {
        const workTypes = LIST_WORK_TYPES.selectAll(state);

        return {
            options: LIST_WORK_TYPES.asOptions(workTypes),
        }
    },
}