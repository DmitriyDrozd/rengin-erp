import { ProCard } from '@ant-design/pro-components';
import { notification, Typography } from 'antd';
import {
    EMPLOYEES,
    ISSUES
} from 'iso/src/store/bootstrap';
import { employeeCategories, employeeRoleEnum } from 'iso/src/store/bootstrap/repos/employees';
import SITES from 'iso/src/store/bootstrap/repos/sites';
import React, { useEffect, useState } from 'react';
import { employeesditor } from '../../../editors/employeesEditor';
import PanelRGrid from '../../../grid/PanelRGrid';
import useLedger from '../../../hooks/useLedger';
import {
    EditorContext,
    useEditor
} from '../chapter-modal/useEditor';
import BaseEditModal from '../BaseItemModal';
import GenericRenFields from '../../form/GenericRenFields';
import { chunkHandler } from '../../../utils/chunkUtils';
import useCurrentUser from '../../../hooks/useCurrentUser';
import { isDirectorRole, isManagementRole, isUserStaffManager } from '../../../utils/userUtils';
import { CommentsLine } from '../../elements/CommentsLine';
import RenField from '../../form/RenField';
import Space from 'antd/es/space';
import { Divider } from 'antd/lib';
import Button from 'antd/es/button';
import { useNotifications } from '../../../hooks/useNotifications';
import { NotificationType } from 'iso/src/store/bootstrap/repos/notifications';
import Badge from 'antd/es/badge';
import Tag from 'antd/es/tag';

const roleMap = {
    [employeeRoleEnum['техник']]: 'techUserId',
    [employeeRoleEnum['техник ИТ']]: 'techUserId',
    [employeeRoleEnum['техник Сервис']]: 'techUserId',
    [employeeRoleEnum['бригадир СМР']]: 'techUserId',
    [employeeRoleEnum['ответственный инженер']]: 'clientsEngineerUserId',
};

const rolesIssues = ISSUES.rolesProps;
const rolesSites = SITES.rolesProps;

const EditEmployeeModal = ({id, isProvidedPage, isRestrictedAccess}: { id: string, isProvidedPage: boolean, isRestrictedAccess: boolean }) => {
    const ledger = useLedger();
    const useEditorData = useEditor(employeesditor, id);
    const { currentUser, headOfUnitId } = useCurrentUser();
    const isDirector = isDirectorRole(currentUser);
    const isEditMode = useEditorData.mode === 'edit';
    const providedPageHref = isProvidedPage ? 'provided' : null;
    const isProvidedStatus = useEditorData.item.category === employeeCategories.provided 
        || (useEditorData.item.category === employeeCategories.blacklist && useEditorData.item.isPendingCategory);

    const {removed, employeeId, clientsEmployeeNumber, ...propsToRender} = EMPLOYEES.properties;

    const filterPropsList = (i) => !!i && !i.headerName.includes('Комментарий') && i.name !== 'category' && i.name !== 'isPendingCategory';
    const list = [clientsEmployeeNumber, ...Array.from(Object.values(propsToRender))].filter(filterPropsList);

    const [addingModes, setAddingModes] = useState({
        issues: false,
        sites: false,
    });
    const switchMode = (mode: string, value: boolean) => setAddingModes({
        ...addingModes,
        [mode]: value,
    });

    const onShowAllItems = (mode: string) => () => switchMode(mode, true);
    const disableAddingMode = (mode: string) => () => switchMode(mode, false);

    const resource = EMPLOYEES;
    const name = resource.getItemName(useEditorData.item);
    const role = roleMap[useEditorData.item.role];

    const showSites = isEditMode && rolesSites.includes(role);
    const showIssues = isEditMode && rolesIssues.includes(role);

    // @ts-ignore
    const sites = showSites ? ledger.sites.list.filter(s => addingModes.sites ? s[role] !== id : s[role] === id) : [];
    // @ts-ignore
    const issues = showIssues ? ledger.issues.list.filter(s => addingModes.issues ? s[role] !== id : s[role] === id) : [];

    const onAddToItems = (list: any[], name: string, idProp: string) => (selectedIds: string[], updateCollection: (updated: any[]) => void) => {
        const updated = list
            .filter(s => selectedIds.includes(s[idProp]))
            .map(s => ({
                ...s,
                [role]: id,
            }));

        chunkHandler(updated, updateCollection);

        notification.open({
            message: `${useEditorData.item.role} добавлен к ${updated.length} ${name}`,
            type: 'success'
        });
    };

    const onRemoveFromItems = (list: any[], name: string, idProp: string) => (selectedIds: string[], updateCollection: (updated: any[]) => void) => {
        const updated = list
            .filter(s => selectedIds.includes(s[idProp]))
            .map(s => ({
                ...s,
                [role]: undefined,
            }));

        chunkHandler(updated, updateCollection);

        notification.open({
            message: `${useEditorData.item.role} удалён из ${updated.length} ${name}`,
            type: 'success'
        });
    };

    
    const [isPendingSent, setIsPendingSent] = useState(false);
    const notifications = useNotifications();

    const handleMoveToChecked = () => {
        useEditorData.updateItemProperty('category')(employeeCategories.checked);
        setIsPendingSent(true);
    }

    const handleMoveToBlacklist = () => {
        useEditorData.updateItemProperties([
            {
                prop: 'category',
                value: employeeCategories.blacklist,
            },
            {
                prop: 'isPendingCategory',
                value: true,
            }
        ]);
        setIsPendingSent(true);

        notifications.createNotification({
            destination: headOfUnitId,
            title: 'Запрос на добавление сотрудника в чёрный список',
            message: `Сотрудник ${useEditorData.item.name} (${useEditorData.item.brandId || 'Ритейл'}) 
                был отправлен в черный список пользователем ${currentUser.name} ${currentUser.lastname}`,
            type: NotificationType.warning,
        });
    }

    const handleDeclineBlacklist = () => {
        useEditorData.updateItemProperties([
            {
                prop: 'category',
                value: employeeCategories.provided,
            },
            {
                prop: 'isPendingCategory',
                value: false,
            }
        ]);

        setIsPendingSent(false);
    }

    const handleApproveBlacklist = () => {
        useEditorData.updateItemProperty('isPendingCategory')(false);
        setIsPendingSent(false);
    }

    useEffect(() => {
        if (isEditMode) {
            useEditorData.save();
        }
    }, [isPendingSent]);

    const actionsButtons = isProvidedPage && (
        <Space>
            <Button color="cyan" onClick={handleMoveToChecked}>В список проверенных</Button>
            <Button danger color="danger" onClick={handleMoveToBlacklist}>В чёрный список</Button>
        </Space>
    );

    const isBlacklist = !isPendingSent && useEditorData.item.category === employeeCategories.blacklist;
    const isSentToBlacklist = isPendingSent && useEditorData.item.category === employeeCategories.blacklist;
    const isSentToChecked = useEditorData.item.category === employeeCategories.checked;
    const sentTo = isSentToBlacklist ? 'Отправлен запрос на добавление в чёрный список' : isSentToChecked ? 'Отправлен в список проверенных' : null;
    const sentNotification = isPendingSent && (
        <Space>
            <Typography.Text>{sentTo}</Typography.Text>
            {
                isDirector && (
                    <>
                        <Button onClick={handleDeclineBlacklist}>Отклонить</Button>
                        <Button danger color="danger" onClick={handleApproveBlacklist}>Подтвердить</Button>
                    </>
                )
            }
        </Space>
    );

    const actionsPlaceholder = isPendingSent ? sentNotification : actionsButtons;
    const badgeText = isBlacklist ? 'чёрный список' : isSentToChecked ? 'Проверенный' : null;
    const badgeColor = isBlacklist ? 'black' : isSentToChecked ? 'blue' : null;

    useEffect(() => {
        if (!useEditorData.item.category) {
            useEditorData.updateItemProperty('category')(employeeCategories.provided);
        }
    }, []);

    useEffect(() => {
        if (id) {
            setIsPendingSent(useEditorData.item.isPendingCategory);
        }
    }, [id]);

    return (
        <EditorContext.Provider value={useEditorData}>
            <BaseEditModal restrictedAccess={isRestrictedAccess} href={providedPageHref}>
                {badgeText && badgeColor && (
                    <Tag color={badgeColor}>{badgeText}</Tag>
                )}
                <GenericRenFields list={list}/>
                <RenField
                    meta={EMPLOYEES.properties.managerComment}
                    hidden={!isDirector && !isManagementRole(currentUser) && !isUserStaffManager(currentUser)}
                    Renderer={CommentsLine}
                    customProperties={{
                        user: currentUser,
                        title: 'Комментарий от менеджера'
                    }}
                />
                <RenField
                    meta={EMPLOYEES.properties.employeeComment}
                    Renderer={CommentsLine}
                    customProperties={{
                        user: currentUser,
                        title: 'Комментарий от сотрудника'
                    }}
                />
                {isProvidedPage && isProvidedStatus && isEditMode && (
                    <>
                        <Divider />
                        <Space style={{ paddingLeft: 20 }}>
                            {actionsPlaceholder}
                        </Space>
                        <Divider />
                    </>
                )}
                <ProCard tabs={{type: 'card'}}>
                    {
                        showSites && (
                            <ProCard.TabPane key="tab1" tab="Объекты">
                                <PanelRGrid
                                    onCancelClick={disableAddingMode('sites')}
                                    onShowAllItems={onShowAllItems('sites')}
                                    onAddToItems={onAddToItems(ledger.sites.list, 'объектам', SITES.idProp)}
                                    onRemoveFromItems={onRemoveFromItems(ledger.sites.list, 'объектов', SITES.idProp)}
                                    createItemProps={{[role]: id}}
                                    title={name}
                                    name={name + '_employee_sites'}
                                    resource={SITES}
                                    rowData={sites}
                                />
                            </ProCard.TabPane>
                        )
                    }
                    {
                        showIssues && (
                            <ProCard.TabPane key="tab2" tab="Заявки">
                                <PanelRGrid
                                    onCancelClick={disableAddingMode('issues')}
                                    onShowAllItems={onShowAllItems('issues')}
                                    onAddToItems={onAddToItems(ledger.issues.list, 'заявкам', ISSUES.idProp)}
                                    onRemoveFromItems={onRemoveFromItems(ledger.issues.list, 'заявок', ISSUES.idProp)}
                                    createItemProps={{[role]: id}}
                                    title={name}
                                    name={name + '_employee_issues'}
                                    resource={ISSUES}
                                    rowData={issues}
                                />
                            </ProCard.TabPane>
                        )
                    }
                </ProCard>
            </BaseEditModal>
        </EditorContext.Provider>
    );
};

export default EditEmployeeModal;
