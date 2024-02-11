import * as React from "react";
import {forwardRef, useEffect, useImperativeHandle, useRef, useState} from "react";
import {Days, optionsFromValuesList, Status, statusesRulesForManager, TICKETS, TicketVO} from "iso";
import {CellEditorProps} from "../../../grid/RGrid";
import {Select} from "antd";
import {BaseSelectRef} from "rc-select";
import useRole from "../../../hooks/useRole";
import {useDispatch, useSelector} from "react-redux";


export default forwardRef((props:CellEditorProps<typeof TICKETS, string> , ref) => {
    const [value, setValue] = useState(props.value || 'Новая');
    const refInput = useRef<BaseSelectRef>(null);

    const dispatch = useDispatch()
    const issue: TicketVO = useSelector(TICKETS.selectors.selectById(props.data.id))

    const setIssueProperty =<P extends keyof TicketVO> (prop: P) => (value: TicketVO[P]) =>
        dispatch(TICKETS.actions.patched({id: issue.id, [prop]:value}))

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
                return Number(value) > 1000;
            }
        };
    });

    return (
        <Select
            options={optionsFromValuesList(TICKETS.attributes.status.enum).map(o => {
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