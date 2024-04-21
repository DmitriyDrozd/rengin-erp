import { ColDef } from 'ag-grid-community';
import React from 'react';
import { useAllColumns } from '../../../grid/RCol';
import ItemChapter, { fieldMetaToProProps } from '../chapter-routed/ItemChapter';
import {
    ProFormSelect,
    ProFormText,
    ProFormTextArea
} from '@ant-design/pro-components';
import LEGALS from 'iso/src/store/bootstrap/repos/legals';
import SITES, { SiteVO } from 'iso/src/store/bootstrap/repos/sites';
import { useSelector } from 'react-redux';
import PanelRGrid from '../../../grid/PanelRGrid';

const RESOURCE = SITES;

export default () => {
    const [cols, colMap] = useAllColumns(RESOURCE);
    const columns: ColDef<SiteVO>[] = [
        {...colMap.clickToEditCol},
        {...colMap.clientsNumberCol, headerName: 'Код обьекта', width: 120},
        {...colMap.brandId, width: 100},
        {...colMap.legalId, width: 150},
        {...colMap.city, width: 120},
        {...colMap.address, width: 150},
        {...colMap.KPP, width: 80},
        {...colMap.clientsEngineerUserId, width: 100},
        {...colMap.managerUserId, width: 100},
        {...colMap.estimatorUserId, width: 100},
        {...colMap.techUserId, width: 100},
        {...colMap.contactInfo, width: 120},
    ] as ColDef<SiteVO>[];

    return (
        <ItemChapter
            resource={RESOURCE}
            renderForm={({item, id, verb, resource}) => {
                const legalValueEnum = useSelector(LEGALS.selectValueEnumByBrandId(item.brandId));

                return (
                    <>
                        <ProFormText  {...fieldMetaToProProps(RESOURCE, 'clientsSiteNumber')} rules={[{required: true}]}/>
                        <ProFormSelect  {...fieldMetaToProProps(RESOURCE, 'brandId')} rules={[{required: true}]}/>
                        <ProFormSelect  {...fieldMetaToProProps(RESOURCE, 'legalId', item)} valueEnum={legalValueEnum}
                                        rules={[{required: true}]}/>
                        <ProFormText {...fieldMetaToProProps(RESOURCE, 'city')} rules={[{required: true}]}/>
                        <ProFormText {...fieldMetaToProProps(RESOURCE, 'address')} rules={[{required: true}]}/>
                        <ProFormText {...fieldMetaToProProps(RESOURCE, 'KPP')}/>
                        <ProFormSelect
                            showSearch
                            allowClear
                            {...fieldMetaToProProps(RESOURCE, 'clientsEngineerUserId')}
                        />
                        <ProFormSelect
                            showSearch
                            allowClear
                            {...fieldMetaToProProps(RESOURCE, 'managerUserId')}
                        />
                        <ProFormSelect
                            showSearch
                            allowClear
                            {...fieldMetaToProProps(RESOURCE, 'estimatorUserId')}
                        />
                        <ProFormSelect
                            showSearch
                            allowClear
                            {...fieldMetaToProProps(RESOURCE, 'techUserId')}
                        />
                        <ProFormTextArea {...fieldMetaToProProps(RESOURCE, 'contactInfo')} />
                    </>
                );
            }
            }
            renderList={() => {
                return (
                    <PanelRGrid
                        columnDefs={columns}
                        resource={SITES}
                        fullHeight={true}
                        title={'Все объекты'}
                    />
                );
            }}
        />
    );
}