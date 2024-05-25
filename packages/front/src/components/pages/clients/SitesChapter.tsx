import { ColDef } from 'ag-grid-community';
import axios from 'axios';
import { roleEnum } from 'iso/src/store/bootstrap/repos/users';
import React, {
    useEffect,
    useState
} from 'react';
import { useAllColumns } from '../../../grid/RCol';
import useCurrentUser from '../../../hooks/useCurrentUser';
import { CellRendererWithCopy } from '../../elements/CellRendererWithCopy';
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

const GOOGLE_MAPS_API_KEY = 'AIzaSyDBhPGRN796X6utRiN6wfEIQXLTHr7FvNA';

export default () => {
    const { currentUser } = useCurrentUser();
    const isViewMode = currentUser.role === roleEnum['менеджер'];

    const [cols, colMap] = useAllColumns(RESOURCE);
    const columns: ColDef<SiteVO>[] = [
        {...colMap.clickToEditCol},
        {...colMap.clientsNumberCol, headerName: 'Код обьекта', width: 120},
        {...colMap.brandId, width: 100},
        {...colMap.legalId, width: 150},
        {...colMap.city, width: 120},
        {...colMap.address, width: 150},
        {...colMap.geoPosition, width: 150},
        {...colMap.KPP, width: 80},
        {...colMap.clientsEngineerUserId, width: 100},
        {...colMap.managerUserId, width: 100},
        {...colMap.estimatorUserId, width: 100},
        {...colMap.techUserId, width: 100},
        {...colMap.contactInfo, width: 120},
    ] as ColDef<SiteVO>[];

    return (
        <ItemChapter
            isViewMode={isViewMode}
            resource={RESOURCE}
            renderForm={(args) => {
                const {item, id, verb, resource} = args;
                const legalValueEnum = useSelector(LEGALS.selectValueEnumByBrandId(item.brandId));
                const isAddressProvided = item.address && item.city;

                const [geoCoordinates, setGeoCoordinates] = useState(item.geoPosition);
                const [isLoadingGeo, setIsLoadingGeo] = useState(false);

                useEffect(() => {
                    if (isAddressProvided) {
                        setIsLoadingGeo(true);
                        const loadUrl = encodeURI(`https://maps.googleapis.com/maps/api/geocode/json?address=Россия, ${item.city}, ${item.address}&key=${GOOGLE_MAPS_API_KEY}`);

                        const config = {
                            method: 'get',
                            url: loadUrl,
                            headers: { }
                        };

                        axios(config)
                            .then(function (response) {
                                if (response.data?.status === 'OK') {
                                    const location = response.data?.results[0]?.geometry?.location;

                                    const geo = [location?.lat, location?.lng].join();
                                    setGeoCoordinates(geo);
                                    setIsLoadingGeo(false);
                                }
                            })
                            .catch(function (error) {
                                console.log(error);
                                setIsLoadingGeo(false);
                            });
                    }
                }, [item.city, item.address]);

                return (
                    <>
                        <ProFormText
                            {...fieldMetaToProProps(RESOURCE, 'clientsSiteNumber')}
                            rules={[{required: true}]}
                            disabled={isViewMode}
                        />
                        <ProFormSelect
                            {...fieldMetaToProProps(RESOURCE, 'brandId')}
                            rules={[{required: true}]}
                            disabled={isViewMode}
                        />
                        <ProFormSelect
                            {...fieldMetaToProProps(RESOURCE, 'legalId', item)}
                            valueEnum={legalValueEnum}
                            rules={[{required: true}]}
                            disabled={isViewMode}
                        />
                        <ProFormText
                            {...fieldMetaToProProps(RESOURCE, 'city')}
                            rules={[{required: true}]}
                            disabled={isViewMode}
                        />
                        <ProFormText
                            {...fieldMetaToProProps(RESOURCE, 'address')}
                            rules={[{required: true}]}
                            disabled={isViewMode}
                        />
                        {geoCoordinates && !item.geoPosition && (
                            <CellRendererWithCopy value={geoCoordinates}/>
                        )}
                        <ProFormText
                            {...fieldMetaToProProps(RESOURCE, 'geoPosition')}
                            placeholder={isLoadingGeo && 'Загрузка координат...'}
                            disabled={isViewMode || !isAddressProvided}
                        />
                        <ProFormText
                            {...fieldMetaToProProps(RESOURCE, 'KPP')}
                            disabled={isViewMode}
                        />
                        <ProFormSelect
                            showSearch
                            allowClear
                            disabled={isViewMode}
                            {...fieldMetaToProProps(RESOURCE, 'clientsEngineerUserId')}
                        />
                        <ProFormSelect
                            showSearch
                            allowClear
                            disabled={isViewMode}
                            {...fieldMetaToProProps(RESOURCE, 'managerUserId')}
                        />
                        <ProFormSelect
                            showSearch
                            allowClear
                            disabled={isViewMode}
                            {...fieldMetaToProProps(RESOURCE, 'estimatorUserId')}
                        />
                        <ProFormSelect
                            showSearch
                            allowClear
                            disabled={isViewMode}
                            {...fieldMetaToProProps(RESOURCE, 'techUserId')}
                        />
                        <ProFormTextArea
                            disabled={isViewMode}
                            {...fieldMetaToProProps(RESOURCE, 'contactInfo')}
                        />
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