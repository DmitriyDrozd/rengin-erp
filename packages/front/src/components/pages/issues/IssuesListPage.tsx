import { AgGridReact } from 'ag-grid-react';
import { estimationStatusesList, estimationsStatusesColorsMap } from 'iso/src/store/bootstrap/repos/expenses';
import { roleEnum, USERS } from 'iso/src/store/bootstrap/repos/users';
import { Days } from 'iso/src/utils';
import { useAllColumns } from '../../../grid/RCol';
import PanelRGrid, { getDisplayedGridRows } from '../../../grid/PanelRGrid';
import {
    issuePaymentStatusesColorMap,
    ISSUES,
    IssueVO,
    paymentTypesColorMap,
    statusesColorsMap,
    statusesList
} from 'iso/src/store/bootstrap/repos/issues';
import { generateNewListItemNumber } from '../../../utils/byQueryGetters';
import { isCustomerHead as getIsCustomerHead, isDepartmentHead, isUserCustomer, isUserIT } from '../../../utils/userUtils';
import AppLayout from '../../app/AppLayout';
import React, { useEffect, useState } from 'react';
import { ColDef } from 'ag-grid-community';
import {
    Badge,
    Button,
    Checkbox,
    Divider,
    Select,
    Space,
    Tag
} from 'antd';
import { NewValueParams } from 'ag-grid-community/dist/lib/entities/colDef';
import {
    useDispatch,
    useSelector
} from 'react-redux';
import useCurrentUser from '../../../hooks/useCurrentUser';
import { getNav } from '../../getNav';
import { ExportArchiveSelector } from './export-archive/ExportArchiveSelector';
import IssueModal from './IssueModal';
import dayjs from 'dayjs';
import useLocalStorageState from '../../../hooks/useLocalStorageState';
import { IssuesMap } from './IssuesMap';
import StatusFilterSelector from './StatusFilterSelector';
import { asMonthYear, isIssueOutdated } from 'iso/src/utils/date-utils';
import IssueStatusCellEditor from './CellEditors/IssueStatusCellEditor';
import IssueSelectCellEditor from './CellEditors/IssueSelectCellEditor';
import {
    ClockCircleOutlined,
    FilterFilled,
    FilterOutlined,
    GlobalOutlined,
    UpOutlined
} from '@ant-design/icons';
import { AntdIcons } from '../../elements/AntdIcons';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useCustomerFilter, useMonthFilter } from './IssuesTableFilters';
import { dateColumnGetter } from './CellEditors/DateCellEditor';
import { textColumnGetter } from './CellEditors/TextCellEditor';
import { onArchiveExport } from './export-archive/utils';

const getEstimationStatusTag = (data: IssueVO) => {
    const { estimationsStatus } = data;
    return <Tag color={estimationsStatusesColorsMap[estimationsStatus]}>{estimationsStatus}</Tag>;
}

const getPaymentTypeTag = (data) => (
    <Tag color={paymentTypesColorMap[data]}>{data}</Tag>
)

const getPaymentStatusTag = (data) => (
    <Tag color={issuePaymentStatusesColorMap[data]}>{data}</Tag>
)

const getStatusTag = (issue: IssueVO) => {
    const currentDJ = dayjs();
    const plannedDJ = issue.plannedDate ? dayjs(issue.plannedDate) : undefined;

    const getTag = () => {
        return <Tag color={statusesColorsMap[issue.status]}>{issue.status}</Tag>;
    };
    let node = getTag();
    if (issue.status === 'В работе') {
        if (currentDJ.isAfter(plannedDJ))
            node = <Badge count={currentDJ.diff(plannedDJ, 'd')} offset={[8, 12]}>{node}</Badge>;
    }
    if (issue.status === 'Выполнена') {
        if (issue.plannedDate && issue.completedDate) {
            if (dayjs(issue.completedDate).isAfter(issue.plannedDate))
                node = <Badge color={'lightpink'} count={dayjs(issue.completedDate).diff(dayjs(issue.plannedDate), 'd')}
                              offset={[-2, 5]}>{node}</Badge>;
        }
        if (!issue.plannedDate || !issue.completedDate) {
            node = <Badge count={<ClockCircleOutlined style={{color: '#d5540a'}}/>} offset={[5, 10]}>{node}</Badge>;
        }
    }
    return <>{node}</>;
};

const onEmailExport = async (ag: AgGridReact) => {
    //  const email = prompt('Укажите почтовый ящик, куда нужн отправить выгрузку')
    const blob = ag.api.getDataAsExcel({}) as any as Blob;
    //const api = await getRestApi()
    const formData = new FormData();
    formData.append('file[]', blob, 'report.xlsx');
    const response = await axios.post(
        '/api/email-export?images=true',
        formData,
        {
            headers: {
                'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
            },
        });//?email=miramaxis@ya.ru&images=true', formData);
    console.log(response.data);

    const url = response.data.url;
    const element = document.createElement('a');
    element.href = url;
    element.download = url;
// simulate link click
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
    document.body.removeChild(element);

};

const BottomBar = () => {
    return (
        <Space>
            <Link to={getNav().importIssues}>
                <Button icon={<AntdIcons.UploadOutlined/>}>
                    Импортировать заявки
                </Button>
            </Link>
        </Space>
    );
};

const outdatedFilter = i => i && isIssueOutdated(i) && !(i.status === 'Выполнена' && !i.completedDate);

const MAP_DIVIDER_HEIGHT = 64;

export default () => {
    const currentItemId = window.location.hash === '' ? undefined : window.location.hash.slice(1);
    const allIssues: IssueVO[] = useSelector(ISSUES.selectAll);
    const {currentUser} = useCurrentUser();
    const isUserEstimator = currentUser.role === roleEnum['сметчик'];
    const isUserEngineer = currentUser.role === roleEnum['инженер'];
    const isCustomer = isUserCustomer(currentUser);
    const isITDepartment = isUserIT(currentUser);
    const isCustomerHead = getIsCustomerHead(currentUser);
    const statusPropToFilter = isUserEstimator ? 'estimationsStatus' : 'status';
    const newClientsNumber = generateNewListItemNumber(allIssues, ISSUES.clientsNumberProp);

    const dispatch = useDispatch();
    const [cols, colMap] = useAllColumns(ISSUES);
    const getDateColumn = dateColumnGetter(dispatch);
    const getTextColumn = textColumnGetter(dispatch);

    const statusColumn = {
        field: 'status',
        filter: 'agSetColumnFilter',
        filterParams: {
            applyMiniFilterWhileTyping: true,
        },
        headerName: 'Статус',
        width: 125,
        editable: currentUser.role !== 'сметчик',
        onCellValueChanged: (event: NewValueParams<IssueVO, IssueVO['status']>) => {
            const issue: Partial<IssueVO> = {issueId: event.data.issueId, status: event.newValue};
            if (event.newValue === 'Выполнена')
                issue.completedDate = dayjs().startOf('d').toISOString();

            dispatch(ISSUES.actions.patched(issue));
        },
        cellEditor: IssueStatusCellEditor,
        cellEditorParams: {
            values: (params) => [params.data.status, 'sd'],// ['Новая','В работе','Выполнена','Отменена','Приостановлена'],
            valueListGap: 0,
        },
        cellRenderer: (props: {
            rowIndex: number
        }) =>
            getStatusTag(props.data)
    };

    const contactInfoColumn = {...getTextColumn('contactInfo'), width: 400, columnToRemove: isCustomer };

    const engineerColumns = [
        {...colMap.clickToEditCol, headerName: 'id'},
        {...colMap.clientsNumberCol},
        {...colMap.description, width: 700},
        {...contactInfoColumn},
        {...colMap.customerComments, width: 400},
        {...statusColumn},
    ];

    const customerColumns = [
        {...colMap.clickToEditCol, headerName: 'id'},
        {...colMap.clientsNumberCol},
        {...statusColumn},
        {...colMap.brandId, width: 150},
        {...colMap.legalId, width: 200},
        {...colMap.siteId, width: 250},
        {...colMap.description, width: 700},
        {...colMap.customerComments, headerName: 'Комментарии', width: 400},
        {...colMap.registerDate, width: 150, cellRenderer: (props) => Days.toDayString(props.data?.registerDate)},
        {...colMap.plannedDate, cellRenderer: (props) => Days.toDayString(props.data?.plannedDate)},
        {...colMap.completedDate, cellRenderer: (props) => Days.toDayString(props.data?.completedDate), width: 115},
        {...colMap.managerUserId, width: 130},
        {...colMap.detalization, width: 180, columnToRemove: !isITDepartment},
    ]

    const defaultColumns = [
        {...colMap.clickToEditCol, headerName: 'id'},
        {...colMap.clientsNumberCol},
        {...getDateColumn('registerDate')},
        {...statusColumn},
        {...colMap.brandId, width: 150},
        {...colMap.legalId, width: 200},
        {...colMap.siteId, width: 250},
        {...colMap.description, width: 350},
        {...contactInfoColumn},
        {...colMap.customerComments, width: 400},
        {...getDateColumn('plannedDate')},
        {...getDateColumn('workStartedDate')},
        {...getDateColumn('completedDate')},
        {...colMap.managerUserId, width: 130},
        {...colMap.techUserId, width: 130},
        {...colMap.clientsEngineerUserId, width: 130},
        {...colMap.estimatorUserId, width: 130},
        {
            field: 'estimationsStatus',
            filter: 'agSetColumnFilter',
            filterParams: {
                applyMiniFilterWhileTyping: true,
            },
            headerName: ISSUES.properties.estimationsStatus.headerName,
            width: 210,
            editable: true,
            onCellValueChanged: (event: NewValueParams<IssueVO, IssueVO['estimationsStatus']>) => {
                const issue: Partial<IssueVO> = {issueId: event.data.issueId, estimationsStatus: event.newValue};
                dispatch(ISSUES.actions.patched(issue));
            },
            cellEditor: IssueSelectCellEditor,
            cellEditorParams: {
                enum: ISSUES.properties.estimationsStatus.enum,
                prop: 'estimationsStatus',
            },
            cellRenderer: (props) =>
                getEstimationStatusTag(props.data)
        },
        {...colMap.estimationPrice, editable: false, width: 130},
        {...colMap.expensePrice, editable: false, width: 100},
        {...colMap.dateFR, width: 150, cellRenderer: ({data}) => asMonthYear(data.dateFR)},
        {
            columnToRemove: !isITDepartment,
            field: 'paymentType',
            filter: 'agSetColumnFilter',
            headerName: ISSUES.properties.paymentType.headerName,
            filterParams: {
                applyMiniFilterWhileTyping: true,
            },
            width: 160, 
            editable: true,
            onCellValueChanged: (event: NewValueParams<IssueVO, IssueVO['paymentType']>) => {
                const issue: Partial<IssueVO> = {issueId: event.data.issueId, paymentType: event.newValue};
                dispatch(ISSUES.actions.patched(issue));
            },
            cellEditor: IssueSelectCellEditor,
            cellEditorParams: {
                enum: ISSUES.properties.paymentType.enum,
                prop: 'paymentType',
            },
            cellRenderer: (props) =>
                getPaymentTypeTag(props.data.paymentType)
        },
        {
            columnToRemove: !isITDepartment,
            field: 'paymentStatus',
            filter: 'agSetColumnFilter',
            filterParams: {
                applyMiniFilterWhileTyping: true,
            },
            headerName: ISSUES.properties.paymentStatus.headerName,
            width: 160, 
            editable: true,
            onCellValueChanged: (event: NewValueParams<IssueVO, IssueVO['paymentStatus']>) => {
                const issue: Partial<IssueVO> = {issueId: event.data.issueId, paymentStatus: event.newValue};
                dispatch(ISSUES.actions.patched(issue));
            },
            cellEditor: IssueSelectCellEditor,
            cellEditorParams: {
                enum: ISSUES.properties.paymentStatus.enum,
                prop: 'paymentStatus',
            },
            cellRenderer: (props) =>
                getPaymentStatusTag(props.data.paymentStatus)
        },
        {...colMap.detalization, width: 180, columnToRemove: !isITDepartment},
    ];

    let rawColumns: ColDef<IssueVO>[] = [];

    if (isCustomer) {
        rawColumns = customerColumns as ColDef<IssueVO>[];
    } else if (isUserEngineer) {
        rawColumns = engineerColumns as ColDef<IssueVO>[];
    } else {
        rawColumns = defaultColumns as ColDef<IssueVO>[];
    }

    const columns: ColDef<IssueVO>[] = rawColumns.filter(c => !c.columnToRemove);

    const [statuses, setStatuses] = useLocalStorageState('issuesStatusFilter', isUserEstimator ? estimationStatusesList : statusesList);
    const [outdated, setOutdated] = useLocalStorageState('issuesOutdatedFilter', false);

    const outdatedIssues = outdated ? allIssues.filter(outdatedFilter) : allIssues;

    let dataForUser;

    switch (currentUser.role) {
        case roleEnum['менеджер']: {
            dataForUser = outdatedIssues.filter(i => i.managerUserId === currentUser.userId);
            break;
        }
        case roleEnum['сметчик']: {
            // todo: отдельная роль руководителя отдела
            const isDepHead = isDepartmentHead(currentUser);
            const userDepartment = currentUser.department;
            const departmentUserIds: string[] = useSelector(USERS.selectAll)
                .filter(u => {
                    const isInDepartment = u.department === userDepartment;
                    const isInRole = u.role === roleEnum['сметчик'];

                    return isInDepartment && isInRole;
                })
                .map(i => i.userId);

            const userIdComparator = (id: string): boolean => isDepHead
                ? departmentUserIds.includes(id)
                : id === currentUser.userId;

            dataForUser = outdatedIssues.filter(i => userIdComparator(i.estimatorUserId));
            break;
        }
        case roleEnum['инженер']: {
            if (isCustomerHead) {
                dataForUser = outdatedIssues.filter(i => i.brandId === currentUser.brandId);
            } else {
                dataForUser = outdatedIssues.filter(i => i.clientsEngineerUserId === currentUser.clientsEngineerUserId);
            }

            break;
        }
        case roleEnum['руководитель']: {
            const userDepartment = currentUser.department;
            const departmentManagersIds: string[] = useSelector(USERS.selectAll)
                    .filter(u => {
                        const isInDepartment = u.department === userDepartment;
                        const isInRole = u.role === roleEnum['менеджер'] || u.role === roleEnum['сметчик'];

                        return isInDepartment && isInRole;
                    })
                    .map(i => i.userId);

            dataForUser = userDepartment
                ? outdatedIssues.filter((i: IssueVO) => {
                        const isManagerInDepartment = departmentManagersIds.includes(i.managerUserId);
                        const isEstimatorInDepartment = departmentManagersIds.includes(i.estimatorUserId);

                        return isManagerInDepartment || isEstimatorInDepartment;
                    })
                : outdatedIssues;
            break;
        }
        default: {
            dataForUser = outdatedIssues;
            break;
        }
    }

    // const gridRef = useRef<AgGridReact<IssueVO>>(null);
    const { 
        monthFRFilter,
        monthFRFilterOptions,
        setMonthFRFilter,
        resetMonthFRFilter,
        filterByFRMonth,
    } = useMonthFilter(dataForUser);

    const {
        customersFilter,
        customersFilterOptions,
        setCustomersFilter,
        resetCustomersFilter,
        filterByCustomer,
    } = useCustomerFilter(dataForUser);

    const filterByStatus = (s: IssueVO) => !s[statusPropToFilter] || statuses.includes(s[statusPropToFilter]);

    const rowData = dataForUser
        .filter(filterByFRMonth)
        .filter(filterByCustomer)
        .filter(filterByStatus);

    const [isExportSelectorOpen, setIsExportSelectorOpen] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]);
    const exportArchiveHandler = (values: string[]) => {
        setSelectedIds(values);
        setIsExportSelectorOpen(true);
    };

    const closeExportSelector = () => {
        setSelectedIds([]);
        setIsExportSelectorOpen(false);
    };

    const renderToolbar = isUserEstimator ? (
            <Space style={{ padding: '0 20px', maxWidth: '100%', overflowX: 'auto' }}>
                <StatusFilterSelector
                    list={estimationStatusesList}
                    colorMap={estimationsStatusesColorsMap}
                    statuses={statuses}
                    setStatuses={setStatuses}
                />
            </Space>
        ) : (
            <Space style={{ padding: '0 20px', maxWidth: '100%', overflowX: 'auto' }}>
                <Checkbox checked={outdated}
                          onChange={e => setOutdated(e.target.checked)}>Просроченные</Checkbox>
                <StatusFilterSelector statuses={statuses} setStatuses={setStatuses}/>
                {monthFRFilterOptions.length && (
                    <Space>
                        Дата ФР
                        <Select
                            allowClear
                            style={{ width: 150 }}
                            onClear={resetMonthFRFilter} 
                            options={monthFRFilterOptions} 
                            value={monthFRFilter} 
                            onChange={setMonthFRFilter}
                        />
                        Заказчик
                        <Select
                            allowClear
                            style={{ width: 150 }}
                            onClear={resetCustomersFilter} 
                            options={customersFilterOptions} 
                            value={customersFilter} 
                            onChange={setCustomersFilter}
                        />
                    </Space>
                )}
            </Space>
    );

    const [isMapOpen, setIsMapOpen] = useState(false);
    const [isFiltersOpen, setIsFiltersOpen] = useState(true);
    const [mapData, setMapData] = useState(rowData);

    useEffect(() => {
        setMapData(rowData);
    }, [statuses]);

    return (
        <AppLayout
            hidePageContainer={true}
            proLayout={{
                contentStyle: {
                    padding: '0px'
                }
            }}
        >
            <div>
                {isMapOpen && (
                    <IssuesMap issues={mapData} />
                )}
                <Divider plain>
                    <Button onClick={() => setIsMapOpen(!isMapOpen)}>{isMapOpen ? <UpOutlined style={{ color: '#0398fc' }} /> : <GlobalOutlined /> }</Button>
                    <div style={{ display: 'inline-block', width: 20 }} />
                    <Button onClick={() => setIsFiltersOpen(!isFiltersOpen)}>{isFiltersOpen ? <FilterFilled style={{ color: '#0398fc' }} /> : <FilterOutlined /> }</Button>
                </Divider>
                {isFiltersOpen && (renderToolbar)}
                {
                    currentItemId ? (
                        <IssueModal
                            disabledEdit={isUserEngineer && !isCustomer}
                            id={currentItemId}
                            newClientsNumber={newClientsNumber}
                        />
                    ) : null
                }
                <ExportArchiveSelector
                    isOpen={isExportSelectorOpen}
                    selectedIds={selectedIds}
                    onClose={closeExportSelector}
                    onExport={onArchiveExport}
                />
                <PanelRGrid
                    fullHeight
                    onFilterChanged={({ api }) => {
                        const displayedRows = getDisplayedGridRows(api);
                        setMapData(displayedRows);
                    }}
                    headerHeight={MAP_DIVIDER_HEIGHT}
                    rowData={rowData}
                    resource={ISSUES}
                    columnDefs={columns}
                    title={'Все заявки'}
                    name={'IssuesList'}
                    onExportArchive={exportArchiveHandler}
                    BottomBar={!isUserEngineer && BottomBar}
                />
            </div>
        </AppLayout>
    );
}