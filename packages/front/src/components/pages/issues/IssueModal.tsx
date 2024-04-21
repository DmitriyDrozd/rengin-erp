import { ISSUES } from 'iso/src/store/bootstrap/';
import React, {
    useEffect,
    useState
} from 'react';
import useLedger from '../../../hooks/useLedger';
import {
    EditorContext,
    useEditor
} from '../chapter-modal/useEditor';
import BaseEditModal from '../BaseItemModal';
import { ProCard } from '@ant-design/pro-components';
import EditIssueItemForm from './tabs/EditIssueFormTab';
import EstimationsTable from './tabs/EstimationsTable';
import ExpensesTable from './tabs/ExpensesTable';
import UploadSection from '../../elements/UploadSection';
import { issuesEditor } from '../../../editors/issueEditor';


export default ({id, newClientsNumber, disabledEdit}: { id: string, newClientsNumber: string, disabledEdit?: boolean }) => {
    const useEditorData = useEditor(issuesEditor, id);
    const ledger = useLedger();
    const isEditMode = useEditorData.mode === 'edit';
    const getFilesProps = (listName: 'workFiles' | 'checkFiles' | 'actFiles', label: string, maxCount = 1) => {
        return {
            items: useEditorData.item[listName],
            onItemsChange: (list: any[]) => {
                useEditorData.getRenFieldProps(listName)
                    .updateItemProperty(list);
            },
            issueId: useEditorData.item.issueId,
            label,
            maxCount,
        };
    };

    const title = useEditorData.mode === 'create'
        ? 'Новая заявка' : ISSUES.getIssueTitle(useEditorData.item);

    const [uploadProps, setUploadProps] = useState<{
        brandName?: string,
        brandPath?: string
    }>({});

    useEffect(() => {
        if (isEditMode && !uploadProps.brandName && !uploadProps.brandPath) {
            const brandName = ledger.brands.list.find(b => b.brandId === useEditorData.item.brandId)?.brandName;
            const issueNumber = useEditorData.item[ISSUES.clientsNumberProp];

            setUploadProps({
                brandName,
                brandPath: `${brandName}_${issueNumber}`,
            });
        }
    }, [id]);

    return (
        <EditorContext.Provider value={useEditorData}>
            <BaseEditModal title={title} disabledEdit={disabledEdit}>
                <ProCard
                    tabs={{
                        type: 'card',
                    }}
                >
                    <ProCard.TabPane key="tab1" tab="Заявка">
                        <EditIssueItemForm newClientsNumber={newClientsNumber} isEditMode={isEditMode}/>
                    </ProCard.TabPane>
                    {!disabledEdit && (
                        <>
                            <ProCard.TabPane key="tab2" tab={'Смета'}>
                                <EstimationsTable/>
                            </ProCard.TabPane>
                            <ProCard.TabPane key="tab3" tab={'Расходы'}>
                                <ExpensesTable/>
                            </ProCard.TabPane>
                        </>
                    )}
                    <ProCard.TabPane key="tab4" tab={'Файлы'}>
                        {!disabledEdit && (
                            <UploadSection
                                {...getFilesProps('checkFiles', 'Чеки', 10)}
                                {...uploadProps}
                            />
                        )}
                        <UploadSection
                            {...getFilesProps('actFiles', 'Акты', 5)}
                            {...uploadProps}
                        />
                        <UploadSection
                            {...getFilesProps('workFiles', 'Работы', 70)}
                            {...uploadProps}
                        />
                    </ProCard.TabPane>
                </ProCard>
            </BaseEditModal>
        </EditorContext.Provider>
    );
}