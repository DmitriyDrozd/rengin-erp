import { GridApi } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { getDisplayedGridRows } from '../../../grid/PanelRGrid';
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
import EXPENSES, { ExpenseVO } from 'iso/src/store/bootstrap/repos/expenses';
import { periodOptions, periodTypesMap } from './components/helpers';
import { DashboardManagerSummary } from './components/DashboardManagerSummary';

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

const mapOffsetToPeriod = (option: string): Period => option.split(',').map((offset: string) => offsetDates[offset]) as Period;

const DEFAULT_PERIOD = {
    selectValue: periodOptions[1].value,
    periodValue: [dayjs(dayjs().subtract(1, 'week')), dayjs(Date.now())] as Period,
}

export default () => {
    const issues: IssueVO[] = useSelector(ISSUES.selectAll);
    const estimations: ExpenseVO[] = useSelector(EXPENSES.selectAll);

    /**
     * Фильтрация по выбранному периоду
     */
    const defaultPeriod = DEFAULT_PERIOD.periodValue;
    const [period, setPeriod] = useState<Period>(defaultPeriod);
    const [periodOption, setPeriodOption] = useState(periodOptions[1]);

    const start = period[0];
    const end = period[1];

    const isWeekSelection = periodOption === periodOptions[1];

    const periodEstimations = estimations.filter(Days.isEstimationInPeriod(period));
    const periodIssues = issues.filter(Days.isIssueInPeriod(period));

    const onPeriodOptionChange = (option: string) => {
        setPeriod(mapOffsetToPeriod(option));

        const selectedPeriodOption = periodOptions.find(o => o.value === option);
        setPeriodOption(selectedPeriodOption);
    };

    /**
     * Применение подфильтров из графиков
     */
    const [currentTab, setCurrentTab] = useState('1');
    const [subjectFilter, setSubjectFilter] = useState<{ [key: string]: () => boolean }>({
        '1': () => true,
        '2': () => true,
        '3': () => true,
        '4': () => true,
        '5': () => true,
    });

    const onChangeSubjectFilter = (key: string) => (filterFunction: () => boolean) => setSubjectFilter({ ...subjectFilter, [key]: filterFunction })

    const subjectFilteredIssues = periodIssues.filter(subjectFilter[currentTab]);

    const finalEstimations = periodEstimations.filter(subjectFilter[currentTab]);
    const finalIssues = subjectFilteredIssues;

    /**
     * Отфильтрованные таблицей записи, предоставляемые в графики
    */
    const gridRef = createRef<AgGridReact>();
    const [listData, setListData] = useState(finalIssues);

    const onIssuesListChanged = ({ api }: { api: GridApi }) => {
        const displayedRows = getDisplayedGridRows(api);
        setListData(displayedRows);
    };

    useEffect(() => {
        if (gridRef.current && gridRef.current.api) {
            onIssuesListChanged({ api: gridRef.current.api });
        } else {
            setListData(finalIssues);
        }
    }, [period]);

    /**
     * Данные для графиков
     */
    const closedIssues = listData.filter(i => i.status === 'Выполнена');
    const activeIssues = listData.filter(Days.isIssueActive);
    const inWorkIssues = listData.filter(Days.isIssueInWork);
    const outdatedIssues = listData.filter(Days.isIssueOutdated);
    const pausedIssues = listData.filter(Days.isIssuePaused);

    const registeredIssues = activeIssues.filter(i => !!i.registerDate && dayjs(i.registerDate).isBetween(start || dayjs(new Date(0)), end));
    const outdatedClosedIssues = outdatedIssues.filter(i => i.status === 'Выполнена' || i.status === 'Отменена');
    const outdatedOpenIssues = outdatedIssues.filter(i => i.status === 'В работе');

    const FiltersItem = ({ children }: { children: React.ReactNode }) => (
        <Space direction='vertical' size={12} style={{ paddingBottom: 12, width: 408 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ textWrap: 'nowrap' }}>За даты:</span>
                <RangePicker
                    allowClear={false}
                    style={{ width: '100%' }}
                    placeholder={['Дата начала', 'Дата конца']}
                    value={period || defaultPeriod}
                    onChange={setPeriod}
                />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ textWrap: 'nowrap' }}>За период:</span>
                <Select
                    defaultValue={DEFAULT_PERIOD.selectValue}
                    value={periodOption.value}
                    onSelect={onPeriodOptionChange}
                    style={{width: '100%'}}
                    options={periodOptions}
                />
            </div>
            {children}
        </Space>
    );

    const items: TabsProps['items'] = [
        {
            key: '1',
            label: 'Заявки',
            children: (
                <DashboadIssuesCharts
                    periodType={periodTypesMap[periodOption.value]}
                    Filters={FiltersItem}
                    allIssues={registeredIssues}
                    onSubFilterChange={onChangeSubjectFilter('1')}
                    performance={{
                        pausedIssues,
                        closedIssues,
                        inWorkIssues,
                        outdatedClosedIssues,
                        outdatedOpenIssues,
                    }}
                />
            ),
        },
        {
            key: '2',
            label: 'Успеваемость',
            children: (
                <DashboardPerformanceCharts
                    Filters={FiltersItem}
                    onSubFilterChange={onChangeSubjectFilter('2')}
                    pausedIssues={pausedIssues}
                    closedIssues={closedIssues}
                    allIssues={registeredIssues}
                    inWorkIssues={inWorkIssues}
                    outdatedClosedIssues={outdatedClosedIssues}
                    outdatedOpenIssues={outdatedOpenIssues}
                />
            ),
        },
        {
            key: '3',
            label: 'Расходы',
            children: (
                <DashboardExpensesCharts
                    allIssues={finalIssues}
                    Filters={FiltersItem}
                    onSubFilterChange={onChangeSubjectFilter('3')} 
                />
            ),
        },
        {
            key: '4',
            label: 'Доходы',
            children: (
                <DashboardProfitCharts
                    allEstimations={finalEstimations}
                    Filters={FiltersItem}
                    onSubFilterChange={onChangeSubjectFilter('4')}
                />
            ),
        },
        {
            key: '5',
            label: 'Отчёт',
            children: (
                <DashboardManagerSummary 
                    periodIssues={closedIssues} 
                    Filters={FiltersItem}
                    updatePeriod={setPeriod}
                    isWeekSelection={isWeekSelection}
                />
            ),
        },
    ];

    const isTableFilterHidden = currentTab === '5';

    return (
        <AppLayout
            hidePageContainer
            proLayout={{
                contentStyle: {
                    padding: '0px'
                }
            }}
        >
            <Card.Grid hoverable={false} style={{ display: 'flex', width: '100%', padding: 20}}>
                <div style={{display: 'flex', width: '100%'}}>
                    <Tabs
                        style={{ width: '100%' }}
                        size='large'
                        items={items}
                        activeKey={currentTab}
                        onChange={setCurrentTab}
                    />
                </div>
            </Card.Grid>
            {!isTableFilterHidden && (
                <Collapse
                size="small"
                defaultActiveKey={[]}
                items={[
                    {
                        key: 'issues-table',
                        label: 'Дополнительная фильтрация через таблицу',
                        children: <DashboardIssuesList gridRef={gridRef} rowData={finalIssues} onFilterChanged={onIssuesListChanged}/>
                    },
                ]}
            />
            )}
            
        </AppLayout>
    );
}