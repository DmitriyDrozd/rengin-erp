import {ISSUES} from "iso/src/store/bootstrap";
import {
    IssueVO,
} from 'iso/src/store/bootstrap/repos/issues';
import { AnyAction, Dispatch } from "redux";
import { TextCellEditor } from "ag-grid-community";

export const textColumnGetter = (dispatch: Dispatch<AnyAction>) => (propName: string) => {
    return {
        field: propName,
        filter: 'agSetColumnFilter',
        filterParams: {
            applyMiniFilterWhileTyping: true,
        },
        headerName: ISSUES.properties[propName].headerName,
        width: 160,
        editable: true,
        onCellValueChanged: (event: NewValueParams<IssueVO, string>) => {
            const issue: Partial<IssueVO> = {issueId: event.data.issueId, [propName]: event.newValue};
            dispatch(ISSUES.actions.patched(issue));
        },
        cellEditor: TextCellEditor,
        cellEditorParams: {
            prop: propName,
        },
    };
};

export default TextCellEditor;
