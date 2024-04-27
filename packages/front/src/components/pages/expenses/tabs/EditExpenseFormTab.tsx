import { Form } from 'antd';
import { EXPENSES } from 'iso/src/store/bootstrap';
import React, {
    FC,
    useEffect,
} from 'react';

import 'dayjs/locale/ru';
import useRole from '../../../../hooks/useRole';
import RenField from '../../../form/RenField';
import { useContextEditor } from '../../chapter-modal/useEditor';
import { layoutPropsModalForm } from '../../../form/ModalForm';

interface EditExpenseItemFormProps {
    newClientsNumber: string,
    isEditMode: boolean
}

export const EditExpenseItemForm: FC<EditExpenseItemFormProps> = ({ newClientsNumber, isEditMode }) => {
    const role = useRole();
    const editor = useContextEditor();

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

            <RenField
                meta={EXPENSES.properties.managerUserId}
                disabled={role === 'сметчик'}
            />
            <RenField meta={EXPENSES.properties.estimatorUserId} />
            <RenField meta={EXPENSES.properties.estimationsStatus} />
        </Form>);
}