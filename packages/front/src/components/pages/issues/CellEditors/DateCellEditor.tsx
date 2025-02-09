import {forwardRef, useEffect, useImperativeHandle, useRef, useState} from "react";
import {ISSUES} from "iso/src/store/bootstrap";
import {CellEditorProps} from "../../../../grid/RGrid";
import locale from 'antd/es/date-picker/locale/ru_RU';
import {
    IssueVO,
} from 'iso/src/store/bootstrap/repos/issues';
import {useDispatch, useSelector} from "react-redux";
import { GENERAL_DATE_FORMAT } from "iso/src/utils/date-utils";
import DatePicker from "antd/es/date-picker";
import dayjs from "dayjs";
import { Days } from "iso/src/utils";
import { AnyAction, Dispatch } from "redux";

const DateCellEditor = forwardRef((props: CellEditorProps<typeof ISSUES, string> , ref) => {
    const dispatch = useDispatch()
    const issue: IssueVO = useSelector(ISSUES.selectById(props.data.issueId))

    const setIssueProperty =<P extends keyof IssueVO> (prop: P) => (value: IssueVO[P]) =>
        dispatch(ISSUES.actions.patched({issueId: issue.issueId, [prop]:value}))

    /* Component Editor Lifecycle methods */
    useImperativeHandle(ref, () => {
        return {
            // the final value to send to the grid, on completion of editing
            getValue() {
                // this simple editor doubles any value entered into the input
                return props.value
            },

            // Gets called once before editing starts, to give editor a chance to
            // cancel the editing before it even starts.
            isCancelBeforeStart() {
                return false;
            },

            // Gets called once when editing is finished (eg if Enter is pressed).
            // If you return true, then the result of the edit will be ignored.
            isCancelAfterEnd() {
                // our editor will reject any value greater than 1000
                return props.value > 1000;
            }
        };
    });

    return (
        <DatePicker
            open
            showTime
            format={GENERAL_DATE_FORMAT}
            allowClear
            locale={locale}
            value={props.value === undefined || props.value === null ? undefined : dayjs(props.value)}
            onChange={e => {
                setIssueProperty(props.prop)(e ? e.toDate().toISOString() : null);
            }}
        />
    );
});

export const dateColumnGetter = (dispatch: Dispatch<AnyAction>) => (propName: string) => {
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
        cellEditor: DateCellEditor,
        cellEditorParams: {
            prop: propName,
        },
        cellRenderer: (props) => Days.toDayString(props.data ? props.data[propName] : ''),
    };
};

export default DateCellEditor;
