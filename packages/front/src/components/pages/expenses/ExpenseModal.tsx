import { EXPENSES } from 'iso/src/store/bootstrap';
import React, {
    FC,
    useEffect,
    useState
} from 'react';
import { expensesEditor } from '../../../editors/expenseEditor';
import useLedger from '../../../hooks/useLedger';
import UploadEstimation from '../../elements/UploadEstimation';
import {
    EditorContext,
    useEditor
} from '../chapter-modal/useEditor';
import BaseEditModal from '../BaseItemModal';
import { ProCard } from '@ant-design/pro-components';
import { EditExpenseItemForm } from './tabs/EditExpenseFormTab';

interface ExpenseModalProps {
    id: string,
    newClientsNumber: string,
    disabledEdit?: boolean
}

export const ExpenseModal: FC<ExpenseModalProps> = ({id, newClientsNumber, disabledEdit}) => {
    const useEditorData = useEditor(expensesEditor, id);
    const ledger = useLedger();
    const isEditMode = useEditorData.mode === 'edit';
    const expenseId = useEditorData.item[EXPENSES.idProp];

    const getFilesProps = (listName: 'expenseFiles', label: string, maxCount = 1) => {
        return {
            items: useEditorData.item[listName].map(i => ({ url: i.url, name: i.name })),
            onItemsChange: (list: any[]) => {
                useEditorData.getRenFieldProps(listName)
                    .updateItemProperty(list);
            },
            expenseId: useEditorData.item.expenseId,
            label,
            maxCount,
        };
    };

    const title = useEditorData.mode === 'create'
        ? 'Новая итоговая смета' : EXPENSES.getIssueTitle(useEditorData.item);

    const [uploadProps, setUploadProps] = useState<{
        brandName?: string,
        brandPath?: string,
    }>({});

    useEffect(() => {
        if (isEditMode && !uploadProps.brandName && !uploadProps.brandPath) {
            const brandName = ledger.brands.list.find(b => b.brandId === useEditorData.item.brandId)?.brandName;

            setUploadProps({
                brandName,
                brandPath: `${brandName}_${expenseId}`,
            });
        }
    }, [id]);

    return (
        <EditorContext.Provider value={useEditorData}>
            <BaseEditModal title={title} restrictedAccess={disabledEdit}>
                <ProCard
                    tabs={{
                        type: 'card',
                    }}
                >
                    <ProCard.TabPane key="tab1" tab="Итоговая смета">
                        <EditExpenseItemForm newClientsNumber={newClientsNumber} isEditMode={isEditMode}/>
                    </ProCard.TabPane>
                    {isEditMode && (
                        <ProCard.TabPane key="tab2" tab={'Файлы'}>
                            <UploadEstimation
                                {...getFilesProps('expenseFiles', 'Сметы', 10)}
                                {...uploadProps}
                                sourceId={expenseId}
                            />
                        </ProCard.TabPane>
                    )}
                </ProCard>
            </BaseEditModal>
        </EditorContext.Provider>
    );
}
