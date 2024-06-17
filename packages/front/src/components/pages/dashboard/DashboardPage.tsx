import { GridApi } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { getDisplayedGridRows } from '../../../grid/PanelRGrid';
import useLedger from '../../../hooks/useLedger';
import AppLayout from '../../app/AppLayout';
import { ISSUES } from 'iso/src/store/bootstrap';
import { useSelector } from 'react-redux';
import {
    Card,
    Collapse,
    DatePicker,
    Select,
    Space,
    Tabs,
    TabsProps,
} from 'antd';
import { IssueVO } from 'iso/src/store/bootstrap/repos/issues';
import React, {
    createRef,
    useEffect,
    useState
} from 'react';
import dayjs, { Dayjs } from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { Days } from 'iso';
import {
    Period
} from 'iso/src/utils/date-utils';
import { DashboadIssuesCharts } from './components/DashboadIssuesCharts';
import { DashboardExpensesCharts } from './components/DashboardExpensesCharts';
import { DashboardIssuesList } from './components/DashboardIssuesList';
import { DashboardPerformanceCharts } from './components/DashboardPerformanceCharts';
import { DashboardProfitCharts } from './components/DashboardProfitCharts';

dayjs.extend(isBetween);

const {RangePicker} = DatePicker;

const today = dayjs(Date.now());
const offsetDates: { [offset: string]: Dayjs } = {
    today,
    day: today.subtract(1, 'day'),
    week: today.subtract(1, 'week'),
    month: today.subtract(1, 'month'),
    year: today.subtract(1, 'year'),
    all: null,
};

const periodOptions = [
    {value: 'day,today', label: 'День' },
    {value: 'week,today', label: 'Неделя' },
    {value: 'month,today', label: 'Месяц'},
    {value: 'year,today', label: 'Год'},
    {value: 'all,today', label: 'Все время'},
];

const mapOffsetToPeriod = (option: string): Period => option.split(',').map((offset: string) => offsetDates[offset]) as Period;

const departmentOptions = [
    {value: 'строительный', label: 'строительный'},
    {value: 'сметный', label: 'сметный'},
    {value: 'сервисный', label: 'сервисный'},
    {value: 'ИТ', label: 'ИТ'},
];

export default () => {
    const issues: IssueVO[] = useSelector(ISSUES.selectAll);
    const ledger = useLedger();


    /**
     * Применение кастомных фильтров
     */
    const [departmentFilter, setDepartmentFilter] = useState([]);
    const filterOptions = {
        department: departmentOptions,
    };

    const departmentFilteredIssues = departmentFilter.length > 0 ? issues.filter(i => {
        const isManagerInDep = departmentFilter.includes(ledger.users.byId[i.managerUserId]?.department);
        const isEstimatorInDep = departmentFilter.includes(ledger.users.byId[i.estimatorUserId]?.department);

        return isManagerInDep || isEstimatorInDep;
    }) : issues;


    /**
     * Фильтрация по выбранному периоду
     */
    const defaultPeriod = [dayjs(dayjs().subtract(1, 'month')), dayjs(Date.now())] as Period;
    const [period, setPeriod] = useState<Period>(defaultPeriod);
    const start = period[0];
    const end = period[1];
    const periodIssues = departmentFilteredIssues.filter(Days.isIssueInPeriod(period));

    const onPeriodOptionChange = (option: string) => {
        setPeriod(mapOffsetToPeriod(option));
    };


    /**
     * Отфильтрованные таблицей записи, предоставляемые в графики
    */
    const gridRef = createRef<AgGridReact>();
    const [listData, setListData] = useState(periodIssues);

    const onIssuesListChanged = ({ api }: { api: GridApi }) => {
        const displayedRows = getDisplayedGridRows(api);
        setListData(displayedRows);
    };

    useEffect(() => {
        if (gridRef.current && gridRef.current.api) {
            onIssuesListChanged({ api: gridRef.current.api });
        }
    }, [departmentFilter, period]);


    /**
     * Данные для графиков
     */
    const closedIssues = listData.filter(i => i.status === 'Выполнена');
    const activeIssues = listData.filter(Days.isIssueActive);
    const outdatedIssues = listData.filter(Days.isIssueOutdated);

    const openedIssues = activeIssues.filter(i => dayjs(i.registerDate).isBetween(start || dayjs(new Date(0)), end));
    const outdatedClosedIssues = outdatedIssues.filter(i => i.status === 'Выполнена' || i.status === 'Отменена');
    const outdatedOpenIssues = outdatedIssues.filter(i => i.status === 'В работе');

    const items: TabsProps['items'] = [
        {
            key: '1',
            label: 'Заявки',
            children: (
                <div style={{ display: 'flex' }}>
                    <DashboadIssuesCharts
                        closedIssues={closedIssues}
                        openedIssues={openedIssues}
                        outdatedClosedIssues={outdatedClosedIssues}
                        outdatedOpenIssues={outdatedOpenIssues}
                    />
                </div>
            ),
        },
        {
            disabled: true,
            key: '2',
            label: 'Успеваемость',
            children: (
                <div style={{ display: 'flex' }}>
                    <DashboardPerformanceCharts />
                </div>
            ),
        },
        {
            disabled: true,
            key: '3',
            label: 'Расходы',
            children: (
                <div style={{ display: 'flex' }}>
                    <DashboardExpensesCharts />
                </div>
            ),
        },
        {
            disabled: true,
            key: '4',
            label: 'Доходы',
            children: (
                <div style={{ display: 'flex' }}>
                    <DashboardProfitCharts />
                </div>
            ),
        },
    ];

    return (
        <AppLayout
            hidePageContainer
            proLayout={{
                contentStyle: {
                    padding: '0px'
                }
            }}
        >
            <Collapse
                size="small"
                defaultActiveKey={['filters', 'charts']}
                items={[
                    {
                        key: 'filters', label: 'Фильтрация', children: (
                            <Card.Grid hoverable={false} style={{ display: 'flex', width: '100%', height: '60px'}}>
                                <Space size={24}>
                                    <>
                                        <span>За даты:</span>
                                        <RangePicker
                                            allowClear={false}
                                            placeholder={['Дата начала', 'Дата конца']}
                                            value={period || defaultPeriod}
                                            onChange={setPeriod}
                                        />
                                    </>
                                    <>
                                        <span>За период:</span>
                                        <Select
                                            defaultValue={'week,today'}
                                            onSelect={onPeriodOptionChange}
                                            style={{width: '150px'}}
                                            options={periodOptions}
                                        />
                                    </>
                                    <>
                                        <span>Отдел:</span>
                                        <Select
                                            mode="multiple"
                                            allowClear
                                            style={{minWidth: '150px'}}
                                            onChange={setDepartmentFilter}
                                            options={filterOptions.department}
                                        />
                                    </>
                                    <>
                                        <span></span>
                                    </>
                                </Space>
                            </Card.Grid>
                        )
                    },
                    {
                        key: 'issues-table',
                        label: 'Таблица заявок',
                        children: <DashboardIssuesList gridRef={gridRef} rowData={periodIssues} onFilterChanged={onIssuesListChanged}/>
                    },
                    {
                        key: 'charts', label: 'Графики', children: (
                            <div style={{display: 'flex'}}>
                                <Tabs
                                    style={{ width: '100%' }}
                                    size='middle'
                                    defaultActiveKey="2"
                                    items={items}
                                />
                            </div>
                        )
                    },
                    // {
                    //     key: 'general-charts',
                    //     label: 'Общие графики',
                    //     children: (
                    //         <Card.Grid hoverable={true} style={gridStyle}>
                    //             <b>Объекты по заказчикам</b>
                    //             <SitesByBrand />
                    //         </Card.Grid>
                    //     )
                    // }
                ]}
            />
        </AppLayout>
    );
}