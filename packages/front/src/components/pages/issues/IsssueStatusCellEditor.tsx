import * as React from "react";
import {forwardRef, useEffect, useImperativeHandle, useRef, useState} from "react";
import {ISSUES} from "iso/src/store/bootstrap";
import {CellEditorProps} from "../../../grid/RGrid";
import {Select} from "antd";
import {BaseSelectRef} from "rc-select";
import {optionsFromValuesList} from "../../form/RenFormSelect";
import {IssueVO, Status, statusesRulesForManager} from "iso/src/store/bootstrap/repos/issues";
import useRole from "../../../hooks/useRole";
import {useDispatch, useSelector} from "react-redux";
import {Days} from "iso";

export default forwardRef((props:CellEditorProps<typeof ISSUES, string> , ref) => {
    const [value, setValue] = useState(props.value);
    const refInput = useRef<BaseSelectRef>(null);

    const dispatch = useDispatch()
    const issue: IssueVO = useSelector(ISSUES.selectById(props.data.issueId))

    const setIssueProperty =<P extends keyof IssueVO> (prop: P) => (value: IssueVO[P]) =>
        dispatch(ISSUES.actions.patched({issueId: issue.issueId, [prop]:value}))

    useEffect(() => {
        // focus on the input
        refInput.current!.focus()
    }, []);

    const role = useRole()
    /* Component Editor Lifecycle methods */
    useImperativeHandle(ref, () => {
        return {
            // the final value to send to the grid, on completion of editing
            getValue() {
                // this simple editor doubles any value entered into the input
                return value
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
                return value > 1000;
            }
        };
    });

    return (
        <Select
            options={optionsFromValuesList(ISSUES.properties.status.enum).map( o => {
                if(role === 'менеджер') {
                    const availableStatuses  = statusesRulesForManager[issue.status]
                    o.disabled = !availableStatuses.includes(o.value)
                }
                return o
            })}
            placeholder={'Статус не указан'}

            onChange={ (value: Status) => {
                if(value === 'В работе') {
                    setIssueProperty('workStartedDate')(Days.today())
                }
                if(value === 'Выполнена') {
                    setIssueProperty('completedDate')(Days.today())
                }
                setIssueProperty('status')(value)
            }}
            ref={refInput}
            value={value}
            style={{width: "100%"}}
        ></Select>

    );
});