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
    Typography
} from 'antd';
import { IssueVO } from 'iso/src/store/bootstrap/repos/issues';
import React, {
    createRef,
    CSSProperties,
    useEffect,
    useState
} from 'react';
import dayjs, { Dayjs } from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { Days } from 'iso';
import {
    Period
} from 'iso/src/utils/date-utils';
import { DashboardIssuesList } from './components/DashboardIssuesList';
import { IssuesByBrand } from './IssuesByBrand';
import { IssuesByManager } from './IssuesByManager';

dayjs.extend(isBetween);

const {RangePicker} = DatePicker;
const gridStyle: CSSProperties = {
    width: '50%',
    textAlign: 'center',
};

const today = dayjs(Date.now());
const offsetDates: { [offset: string]: Dayjs } = {
    today,
    one: today.subtract(1, 'month'),
    two: today.subtract(2, 'month'),
    three: today.subtract(3, 'month'),
    six: today.subtract(6, 'month'),
    year: today.subtract(1, 'year'),
    all: null,
};

const periodOptions = [
    {value: 'one,today', label: 'Месяц'},
    {value: 'two,today', label: '2 Месяца'},
    {value: 'three,today', label: '3 Месяца'},
    {value: 'six,today', label: 'Полгода'},
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
                            <Card.Grid hoverable={false} style={{width: '100%', height: '80px'}}>
                                <span style={{paddingRight: '24px'}}>За даты:</span>
                                <RangePicker
                                    allowClear={false}
                                    placeholder={['Дата начала', 'Дата конца']}
                                    value={period || defaultPeriod}
                                    onChange={setPeriod}
                                />
                                <span style={{padding: '0 24px'}}>За период:</span>
                                <Select
                                    defaultValue={'one,today'}
                                    onSelect={onPeriodOptionChange}
                                    style={{width: '150px'}}
                                    options={periodOptions}
                                />
                                <span style={{padding: '0 24px'}}>Фильтры:</span>
                                <Space>
                                    <Typography.Text>По отделу</Typography.Text>
                                    <Select
                                        mode="multiple"
                                        allowClear
                                        style={{minWidth: '150px'}}
                                        onChange={setDepartmentFilter}
                                        options={filterOptions.department}
                                    />
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
                                <Card.Grid hoverable={false} style={gridStyle}>
                                    <b>Заявки по менеджерам</b>
                                    <IssuesByManager
                                        closedIssues={closedIssues}
                                        openedIssues={openedIssues}
                                        outdatedClosedIssues={outdatedClosedIssues}
                                        outdatedOpenIssues={outdatedOpenIssues}
                                    />
                                </Card.Grid>

                                <Card.Grid hoverable={false} style={gridStyle}>
                                    <b>Заявки по заказчикам</b>
                                    <IssuesByBrand
                                        closedIssues={closedIssues}
                                        openedIssues={openedIssues}
                                        outdatedClosedIssues={outdatedClosedIssues}
                                        outdatedOpenIssues={outdatedOpenIssues}
                                    />
                                </Card.Grid>
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