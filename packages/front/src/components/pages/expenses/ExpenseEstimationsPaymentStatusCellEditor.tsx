import {
    EstimationPaymentStatus,
    ExpenseVO
} from 'iso/src/store/bootstrap/repos/expenses';
import * as React from 'react';
import {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useRef,
    useState
} from 'react';
import { EXPENSES } from 'iso/src/store/bootstrap';
import { CellEditorProps } from '../../../grid/RGrid';
import { Select } from 'antd';
import { BaseSelectRef } from 'rc-select';
import { optionsFromValuesList } from '../../form/RenFormSelect';
import {
    useDispatch,
    useSelector
} from 'react-redux';

export const ExpenseEstimationsPaymentStatusCellEditor = forwardRef((props: CellEditorProps<typeof EXPENSES, string>, ref) => {
    const [value] = useState(props.value);
    const refInput = useRef<BaseSelectRef>(null);

    const dispatch = useDispatch();
    const expense: ExpenseVO = useSelector(EXPENSES.selectById(props.data.expenseId));

    const setIssueProperty = <P extends keyof ExpenseVO>(prop: P) => (value: ExpenseVO[P]) =>
        dispatch(EXPENSES.actions.patched({expenseId: expense.expenseId, [prop]: value}));

    useEffect(() => {
        // focus on the input
        refInput.current!.focus();
    }, []);

    /* Component Editor Lifecycle methods */
    useImperativeHandle(ref, () => {
        return {
            // the final value to send to the grid, on completion of editing
            getValue() {
                // this simple editor doubles any value entered into the input
                return value;
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
            options={optionsFromValuesList(EXPENSES.properties.estimationsPaymentStatus.enum)}
            placeholder={'Статус не указан'}
            onChange={(value: EstimationPaymentStatus) => {
                setIssueProperty('estimationsPaymentStatus')(value);
            }}
            ref={refInput}
            value={value}
            style={{width: '100%'}}
        ></Select>

    );
});