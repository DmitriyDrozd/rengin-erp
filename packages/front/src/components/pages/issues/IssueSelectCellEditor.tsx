import {forwardRef, useEffect, useImperativeHandle, useRef, useState} from "react";
import {ISSUES} from "iso/src/store/bootstrap";
import {CellEditorProps} from "../../../grid/RGrid";
import {Select} from "antd";
import {BaseSelectRef} from "rc-select";
import {optionsFromValuesList} from "../../form/RenFormSelect";
import {
    IssueVO,
} from 'iso/src/store/bootstrap/repos/issues';
import {useDispatch, useSelector} from "react-redux";

export default forwardRef((props: CellEditorProps<typeof ISSUES, string> , ref) => {
    const refInput = useRef<BaseSelectRef>(null);

    const dispatch = useDispatch()
    const issue: IssueVO = useSelector(ISSUES.selectById(props.data.issueId))

    const setIssueProperty =<P extends keyof IssueVO> (prop: P) => (value: IssueVO[P]) =>
        dispatch(ISSUES.actions.patched({issueId: issue.issueId, [prop]:value}))

    useEffect(() => {
        // focus on the input
        refInput.current!.focus()
    }, []);

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

    const options = optionsFromValuesList(props.enum);

    return (
        <Select
            options={options}
            placeholder={'Статус не указан'}
            onChange={ (value: any) => {
                setIssueProperty(props.prop)(value)
            }}
            ref={refInput}
            value={props.value}
            style={{width: "100%"}}
        ></Select>

    );
});