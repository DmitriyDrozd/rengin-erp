import { ISSUES } from 'iso/src/store/bootstrap/';
import React from 'react';
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


export default ({id, newClientsNumber}: { id: string, newClientsNumber: string }) => {
    const useEditorData = useEditor(issuesEditor, id);
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

    return (
        <EditorContext.Provider value={useEditorData}>
            <BaseEditModal title={title}>
                <ProCard
                    tabs={{
                        type: 'card',
                    }}
                >
                    <ProCard.TabPane key="tab1" tab="Заявка">
                        <EditIssueItemForm newClientsNumber={newClientsNumber}/>
                    </ProCard.TabPane>
                    <ProCard.TabPane key="tab2" tab={'Смета'}>
                        <EstimationsTable/>
                    </ProCard.TabPane>
                    <ProCard.TabPane key="tab3" tab={'Расходы'}>
                        <ExpensesTable/>
                    </ProCard.TabPane>
                    <ProCard.TabPane key="tab4" tab={'Файлы'}>
                        <UploadSection {...getFilesProps('checkFiles', 'Чеки', 10)}/>
                        <UploadSection {...getFilesProps('actFiles', 'Акты', 5)}/>
                        <UploadSection {...getFilesProps('workFiles', 'Работы', 70)}/>
                    </ProCard.TabPane>

                </ProCard>

            </BaseEditModal>
        </EditorContext.Provider>
    );
}