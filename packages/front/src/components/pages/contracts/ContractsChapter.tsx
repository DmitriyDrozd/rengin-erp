import { generateGuid } from '@sha/random';
import { SITES } from 'iso/src/store/bootstrap';
import { RESOURCES_MAP } from 'iso/src/store/bootstrap/resourcesList';
import { GENERAL_DATE_FORMAT } from 'iso/src/utils/date-utils';
import React, { useState } from 'react';
import ItemChapter, { fieldMetaToProProps } from '../chapter-routed/ItemChapter';
import {
    ProForm,
    ProFormDatePicker,
    ProFormMoney,
    ProFormSelect,
    ProFormText
} from '@ant-design/pro-components';
import { useAllColumns } from '../../../grid/RCol';
import LEGALS from 'iso/src/store/bootstrap/repos/legals';
import {
    notification,
    Row,
    Space
} from 'antd';
import useLedger from '../../../hooks/useLedger';
import CONTRACTS, { ContractVO } from 'iso/src/store/bootstrap/repos/contracts';
import {
    useDispatch,
    useSelector
} from 'react-redux';
import PanelRGrid from '../../../grid/PanelRGrid';
import { SUBS, SubVO } from 'iso/src/store/bootstrap/repos/subs';

const renderForm = ({item, id, verb, resource}) => {
    const legalValueEnum = useSelector(LEGALS.selectValueEnumByBrandId(item.brandId));
    return (
        <>
            <ProFormText {...fieldMetaToProProps(CONTRACTS, 'contractNumber', item)}
                         rules={[{required: true}]}  width="sm"/>
            <ProForm.Item label={'Заказчик'} required={true}>
                <Row>
                    <ProFormSelect {...fieldMetaToProProps(CONTRACTS, 'brandId', item)} label={null}
                                   width={'sm'}
                                   rules={[{required: true}]}/>
                    <ProFormSelect {...fieldMetaToProProps(CONTRACTS, 'legalId', item)} label={null}
                                   width={'md'}
                                   valueEnum={legalValueEnum} rules={[{required: true}]}/>
                </Row>
            </ProForm.Item>
            <ProForm.Item label={'Дата подписания'}>
                <Row>
                    <Space>
                        <ProFormDatePicker
                            {...fieldMetaToProProps(CONTRACTS, 'signDate', item)}
                            label={null}
                            width={'sm'}
                            rules={[]}
                            format={GENERAL_DATE_FORMAT}
                        />
                        <ProFormDatePicker
                            {...fieldMetaToProProps(CONTRACTS, 'endDate', item)}
                            label={'Действует до'}
                            width={'sm'}
                            rules={[]}
                            format={GENERAL_DATE_FORMAT}
                        />
                    </Space>
                </Row>
            </ProForm.Item>
            <ProFormMoney locale={'ru-RU'} {...fieldMetaToProProps(CONTRACTS, 'rate', item)}
                          label={'Ставка за объект'} width={'sm'} rules={[]}/>
            <ProFormText {...fieldMetaToProProps(CONTRACTS, 'managerUserId')} width="md" />
        </>
    );
};

const renderItemInfo = ({item, id}: { item: ContractVO, id: string }) => {
    const ledger = useLedger();
    const [isAddingMode, setAddingMode] = useState(false);
    const dispatch = useDispatch();

    const onShowAllItems = () => setAddingMode(true);
    const disableAddingMode = () => setAddingMode(false);

    const subList = ledger.subs.list.filter(s => s.contractId === item.contractId);
    const connectedSites = subList.map(s => s.siteId);
    const sitesList = ledger.sites.list.filter(site => !connectedSites.includes(site.siteId));

    const onAddToItems = (selectedIds: string[], updateCollection: (updated: any[]) => void) => {
        const newSubs: SubVO[] = selectedIds.map(siteId => {
            const siteManagerId = ledger.sites.byId[siteId]?.managerUserId;

            return {
                subId: generateGuid(),
                contractId: id,
                subscribeDate: item.signDate,
                unsubscribeDate: item.endDate,
                siteId,
                rate: item.rate,
                managerUserId: item.managerUserId || siteManagerId,
            }
        });

        const getAction = () => SUBS.actions.addedBatch(newSubs);
        dispatch(getAction());

        notification.open({
            message: `${newSubs.length} объектов добавлено к договору`,
            type: 'success'
        });
    };

    return (
        <PanelRGrid
            createItemProps={{contractId: id}}
            resource={isAddingMode ? SITES : SUBS}
            title={'Подключённые объекты'}
            rowData={isAddingMode ? sitesList : subList}
            onCancelClick={disableAddingMode}
            onShowAllItems={onShowAllItems}
            onAddToItems={onAddToItems}
        />
    );
}

export default () => {
    const [cols] = useAllColumns(CONTRACTS);

    return (
        <ItemChapter
            resource={RESOURCES_MAP.CONTRACTS}
            renderForm={renderForm}
            renderItemInfo={renderItemInfo}
            renderList={({form, verb, resource}) => {
                return (
                    <div>
                        <PanelRGrid
                            fullHeight={true}
                            resource={CONTRACTS}
                            title={'Все договоры'}
                            columnDefs={[...cols]}
                        />
                    </div>
                );
            }}
        />
    );
}