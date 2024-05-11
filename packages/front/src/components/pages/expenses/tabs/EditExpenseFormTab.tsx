import { isArray } from '@sha/utils';
import { Form } from 'antd';
import { Days } from 'iso';
import { EXPENSES } from 'iso/src/store/bootstrap';
import { getDiffAndDiffPercent } from 'iso/src/utils/moneyUtils';
import React, {
    FC,
    useEffect,
    useMemo,
} from 'react';

import 'dayjs/locale/ru';
import useRole from '../../../../hooks/useRole';
import RenField from '../../../form/RenField';
import {
    useContextEditor,
    useContextEditorProperty
} from '../../chapter-modal/useEditor';
import { layoutPropsModalForm } from '../../../form/ModalForm';

interface EditExpenseItemFormProps {
    newClientsNumber: string,
    isEditMode: boolean
}

export const EditExpenseItemForm: FC<EditExpenseItemFormProps> = ({ newClientsNumber, isEditMode }) => {
    const role = useRole();
    const editor = useContextEditor();
    const priceProp = useContextEditorProperty(EXPENSES.properties.expensePrice.name);
    const priceFinalProp = useContextEditorProperty(EXPENSES.properties.expensePriceFinal.name);
    const expenseFilesProp = useContextEditorProperty(EXPENSES.properties.expenseFiles.name);

    const [priceDiff, priceDiffPercent] = useMemo(
        () => getDiffAndDiffPercent(priceProp.value, priceFinalProp.value),
        [priceProp.value, priceFinalProp.value]
    );

    const expenseFileName = isArray(expenseFilesProp.value) ? expenseFilesProp.value[0]?.name : undefined;

    useEffect(() => {
        if (!editor.item[EXPENSES.clientsNumberProp]) {
            editor.updateItemProperty(EXPENSES.clientsNumberProp)(newClientsNumber);
        }
    }, []);

    return (
        <Form
            style={{maxWidth: 800}}
            {...layoutPropsModalForm}
            layout={'horizontal'}
        >
            <RenField meta={EXPENSES.properties.clientsExpenseNumber}/>
            <RenField meta={EXPENSES.properties.brandId}/>
            <RenField meta={EXPENSES.properties.legalId}/>
            <RenField meta={EXPENSES.properties.dateFR} customProperties={{
                format: Days.FORMAT_MONTH_YEAR,
                picker: 'month',
            }}/>
            <RenField
                meta={EXPENSES.properties.managerUserId}
                disabled={role === 'сметчик'}
            />
            <RenField meta={EXPENSES.properties.estimatorUserId} />
            <RenField meta={EXPENSES.properties.estimationsStatus} />
            <RenField meta={EXPENSES.properties.expensePrice} />
            <RenField meta={EXPENSES.properties.expensePriceFinal} />
            <Form.Item label={'Разница, сумма'}>{priceDiff}</Form.Item>
            <Form.Item label={'Разница, %'}>{priceDiffPercent}%</Form.Item>
            <Form.Item label={'Файл сметы'}>{expenseFileName}</Form.Item>
        </Form>
    );
}