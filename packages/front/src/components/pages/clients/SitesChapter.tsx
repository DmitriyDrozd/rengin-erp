import { ColDef } from 'ag-grid-community';
import {
    Button,
    Modal,
    notification,
    Space
} from 'antd';
import axios from 'axios';
import { roleEnum } from 'iso/src/store/bootstrap/repos/users';
import React, {
    useEffect,
    useMemo,
    useState
} from 'react';
import { GOOGLE_MAPS_API_KEY } from '../../../env';
import { useAllColumns } from '../../../grid/RCol';
import useCurrentUser from '../../../hooks/useCurrentUser';
import useLedger from '../../../hooks/useLedger';
import { CellRendererWithCopy } from '../../elements/CellRendererWithCopy';
import { ProgressCircle } from '../../misc/ProgressCircle';
import ItemChapter, { fieldMetaToProProps } from '../chapter-routed/ItemChapter';
import {
    ProFormSelect,
    ProFormText,
    ProFormTextArea
} from '@ant-design/pro-components';
import LEGALS from 'iso/src/store/bootstrap/repos/legals';
import SITES, { SiteVO } from 'iso/src/store/bootstrap/repos/sites';
import {
    useDispatch,
    useSelector
} from 'react-redux';
import {
    call,
    put,
} from 'typed-redux-saga';
import PanelRGrid, { getDisplayedGridRows } from '../../../grid/PanelRGrid';
import Typography from 'antd/es/typography';
import { sleep } from '@sha/utils/src/async';
import Divider from 'antd/lib/divider';
import { SitesMap } from './SitesMap';
import GlobalOutlined from '@ant-design/icons/lib/icons/GlobalOutlined';
import UpOutlined from '@ant-design/icons/lib/icons/UpOutlined';
import { isUserIT } from '../../../utils/userUtils';

const RESOURCE = SITES;

const GMAPS_CHUNK_SIZE = 50;
const CHUNK_SIZE = 1000;
/**
 * Mongo processes one record around 120ms
 */
const itemImportTime = 120;
const chunkImportInterval = itemImportTime * CHUNK_SIZE;

const MAP_DIVIDER_HEIGHT = 64;

const getGmapsPromises = (sites) => {
    return sites.map(site => {
        return new Promise(async (resolve, reject) => {
            const loadUrl = encodeURI(`https://maps.googleapis.com/maps/api/geocode/json?address=Россия, ${site.city}, ${site.address}&key=${GOOGLE_MAPS_API_KEY}`);
            const config = {
                method: 'get',
                url: loadUrl,
                headers: {}
            };

            const response = await axios(config);

            if (response.data?.status === 'OK') {
                const location = response.data?.results[0]?.geometry?.location;

                site.geoPosition = [location?.lat, location?.lng].join();
                resolve(site);
            }
        });
    });
};

export default () => {
    const {currentUser} = useCurrentUser();
    const isITDepartment = isUserIT(currentUser);
    const isViewMode = currentUser.role === roleEnum['менеджер'] && !isITDepartment;

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

    const ledger = useLedger();
    const dispatch = useDispatch();
    const allSites = ledger.sites.list;
    const isAllSitesHasGeo = allSites.every(site => !!site.geoPosition);

    const [percent, setPercent] = useState(0);

    const onAddGeo = async () => {
        setPercent(1);

        const sitesWithoutGeo = allSites.filter(site => {
            const isAddressProvided = site.address && site.city;

            return !site.geoPosition && isAddressProvided;
        });

        const chunkCount = Math.ceil(sitesWithoutGeo.length / GMAPS_CHUNK_SIZE);
        const itemsInChunk = Math.ceil(sitesWithoutGeo.length / chunkCount);
        const percentPerChunk = 100 / chunkCount;

        let resultSites: any[] = [];

        if (sitesWithoutGeo.length < GMAPS_CHUNK_SIZE) {
            resultSites = await Promise.all(getGmapsPromises(sitesWithoutGeo));
        } else {
            for (let i = 0; i <= chunkCount; i++) {
                const chunk = sitesWithoutGeo.slice(i * itemsInChunk, (i + 1) * itemsInChunk);

                try {
                    const chunkResult = await Promise.all(getGmapsPromises(chunk));
                    resultSites = [...resultSites, ...chunkResult];
                    console.log('resultSites: ', i, '/', chunkCount, ': ', resultSites);

                    const progress = percentPerChunk * i > 1 ? percentPerChunk * i : 1;
                    setPercent(progress);
                } catch (e) {
                    console.error(e);
                    notification.open({
                        message: `Не удалось выполнить запросы`,
                        type: 'error'
                    });
                }
            }
        }
        
        const updated = resultSites.filter(s => s !== null);
        const updatedCount = updated.length;
        console.log(updated);

        if (updated.length) {
            if (updated.length > CHUNK_SIZE) {
                const _chunkCount = Math.ceil(updated.length / CHUNK_SIZE);
                const _itemsInChunk = Math.ceil(updated.length / _chunkCount);

                for (let i = 0; i < _chunkCount; i++) {
                    const _chunk = updated.slice(i * _itemsInChunk, (i + 1) * _itemsInChunk);
                    console.log('dispatched put ', _chunk.length, ' items');

                    dispatch(SITES.actions.updatedBatch(_chunk));
                }
            } else {
                dispatch(SITES.actions.updatedBatch(updated));
            }
        }

        setTimeout(() => {
            setPercent(0);

            notification.open({
                message: `Добавлены координаты к ${updatedCount} объектам`,
                type: 'success'
            });
        }, updatedCount * 5);
    };

    const isLoadingGeo = percent > 0;
    const BottomBar = isAllSitesHasGeo ? undefined : () => (
        <Space>
            <Button onClick={onAddGeo}>Добавить локацию ко всем объектам</Button>
        </Space>
    );

    const [isMapOpen, setIsMapOpen] = useState(false);
    const [mapData, setMapData] = useState(allSites);

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
                            headers: {}
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
                            <div className="ant-form-item">
                                <div className="ant-row ant-form-item-row">
                                    <div className="ant-col ant-col-6 ant-form-item-label">
                                        <Typography.Text>Предложенные координаты: </Typography.Text>
                                    </div>
                                    <div className="ant-col ant-col-18 ant-form-item-control">
                                        <CellRendererWithCopy value={geoCoordinates}/>
                                    </div>
                                </div>
                            </div>
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
                            label={isITDepartment ? 'Исполнитель' : null}
                            placeholder={isITDepartment ? 'Исполнитель' : null}
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
                    <>
                        <Modal centered cancelButtonProps={{loading: isLoadingGeo}} open={isLoadingGeo} closable={false}
                                confirmLoading={isLoadingGeo}>
                            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                <ProgressCircle progress={Math.floor(percent)} label={'Загрузка данных геопозиции'}/>
                            </div>
                        </Modal>
                        {isMapOpen && (
                            <SitesMap sites={mapData} />
                        )}
                        <Divider plain>
                            <Button onClick={() => setIsMapOpen(!isMapOpen)}>{isMapOpen ? <UpOutlined /> : <GlobalOutlined /> }</Button>
                        </Divider>
                        <PanelRGrid
                            BottomBar={BottomBar}
                            columnDefs={columns}
                            headerHeight={MAP_DIVIDER_HEIGHT}
                            resource={SITES}
                            fullHeight={true}
                            title={'Все объекты'}
                            onFilterChanged={({ api }) => {
                                const displayedRows = getDisplayedGridRows(api);
                                setMapData(displayedRows);
                            }}
                        />
                    </>
                );
            }}
        />
    );
}