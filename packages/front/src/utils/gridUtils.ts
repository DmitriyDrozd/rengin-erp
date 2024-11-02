import { ColumnState } from "ag-grid-community/dist/lib/columns/columnModel";
import { ColDef } from "ag-grid-community/dist/lib/entities/colDef";


/**
 * @param state sorted by displayed columns
 * @param defs coldefs
 * @returns 
 */
export const mapColumnStateToDefs = (state: ColumnState[], defs: ColDef<any>[]): any => {
    if (!state || state.length === 0) {
        return defs;
    }

    // result shoud be based on defs and sorted by state sequence
    return state
        .map((colState) => {
            const def = defs.find(({ field }) => colState.colId === field) || {};

            return {
                ...def,
                ...colState,
            };
        })
        .filter(({ colId }) => !!defs.find(def => def.field === colId));
}