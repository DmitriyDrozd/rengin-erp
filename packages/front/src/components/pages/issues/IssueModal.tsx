import { EXPENSES } from 'iso/src/store/bootstrap';
import { ISSUES } from 'iso/src/store/bootstrap/';
import React, {
    useEffect,
    useState
} from 'react';
import useLedger from '../../../hooks/useLedger';
import UploadEstimation from '../../elements/UploadEstimation';
import {
    EditorContext,
    useEditor
} from '../chapter-modal/useEditor';
import BaseEditModal from '../BaseItemModal';
import { ProCard } from '@ant-design/pro-components';
import EditIssueItemForm from './tabs/EditIssueFormTab';
import EstimationsTable from './tabs/EstimationsTable';
import ExpensesTable from './tabs/ExpensesTable';
import UploadIssue from '../../elements/UploadIssue';
import { issuesEditor } from '../../../editors/issueEditor';
import { IssueVO } from 'iso/src/store/bootstrap/repos/issues';
import { SiteVO } from 'iso/src/store/bootstrap/repos/sites';
import { CellRendererWithCopy } from '../../elements/CellRendererWithCopy';
import { Days } from 'iso/src/utils';
import useCurrentUser from '../../../hooks/useCurrentUser';
import { isManagementRole, isUserCustomer } from '../../../utils/userUtils';


export default ({id, newClientsNumber, disabledEdit}: { id: string, newClientsNumber: string, disabledEdit?: boolean }) => {
    const { currentUser } = useCurrentUser();
    const isCustomerRestriction = isUserCustomer(currentUser) && !isManagementRole(currentUser);
    const useEditorData = useEditor(issuesEditor, id);
    const issueId = useEditorData.item.issueId;

    const ledger = useLedger();
    const isEditMode = useEditorData.mode === 'edit';
    const getFilesProps = (listName: 'workFiles' | 'checkFiles' | 'actFiles' | 'expenseFiles', label: string, maxCount = 1) => {
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

    const getIssueTitle = (issue: IssueVO) => {
        const site: SiteVO = ledger.sites.byId[issue.siteId];
        const siteAddress = site ? site.city + ' ' + site.address + ' ' : ' НЕ УКАЗАН ';

        return (
            <>
                <CellRendererWithCopy value={issue.clientsIssueNumber}/><> по адресу </>
                <CellRendererWithCopy value={siteAddress}/>
                {site && <>код <CellRendererWithCopy value={site.clientsSiteNumber}/></>}
                <> от </>{Days.toDayString(issue.registerDate)}
            </>
        );
    };

    const title = useEditorData.mode === 'create'
        ? 'Новая заявка' : getIssueTitle(useEditorData.item);

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
            <BaseEditModal title={title} restrictedAccess={disabledEdit}>
                <ProCard
                    tabs={{
                        type: 'card',
                    }}
                >
                    <ProCard.TabPane key="tab1" tab="Заявка">
                        <EditIssueItemForm newClientsNumber={newClientsNumber} isEditMode={isEditMode}/>
                    </ProCard.TabPane>
                    {!disabledEdit && !isCustomerRestriction && (
                        <>
                            <ProCard.TabPane key="tab2" tab={'Смета'}>
                                <EstimationsTable/>
                            </ProCard.TabPane>
                            <ProCard.TabPane key="tab3" tab={'Расходы'}>
                                <ExpensesTable/>
                            </ProCard.TabPane>
                        </>
                    )}
                    <ProCard.TabPane key="tab4" tab={'Файлы'} disabled={!isEditMode}>
                        {!disabledEdit && !isCustomerRestriction && (
                            <UploadIssue
                                {...getFilesProps('checkFiles', 'Чеки', 100)}
                                {...uploadProps}
                            />
                        )}
                        <UploadIssue
                            {...getFilesProps('actFiles', 'Акты', 100)}
                            {...uploadProps}
                        />
                        <UploadIssue
                            {...getFilesProps('workFiles', 'Работы', 100)}
                            {...uploadProps}
                        />
                        <UploadEstimation
                            {...getFilesProps('expenseFiles', 'Сметы', 100)}
                            actionPath='/api/upload/issue/'
                            sourceId={issueId}
                        />
                    </ProCard.TabPane>
                </ProCard>
            </BaseEditModal>
        </EditorContext.Provider>
    );
}