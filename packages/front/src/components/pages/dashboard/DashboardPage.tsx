import AppLayout from '../../app/AppLayout';
import { ISSUES } from 'iso/src/store/bootstrap';
import { useSelector } from 'react-redux';
import IssueChart from './IssueChart';
import {
    Card,
    DatePicker,
    Select
} from 'antd';
import { IssueVO } from 'iso/src/store/bootstrap/repos/issues';
import { CSSProperties, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { Days } from 'iso';
import {
    asDayOrToday,
    Period
} from 'iso/src/utils/date-utils';

dayjs.extend(isBetween);

const { RangePicker } = DatePicker;
const gridStyle: CSSProperties = {
    width: '50%',
    height: '300px',
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
    { value: 'one,today', label: 'Месяц' },
    { value: 'two,today', label: '2 Месяца' },
    { value: 'three,today', label: '3 Месяца' },
    { value: 'six,today', label: 'Полгода' },
    { value: 'year,today', label: 'Год' },
    { value: 'all,today', label: 'Все время' },
];
const mapOffsetToPeriod = (option: string): Period => option.split(',').map((offset: string) => offsetDates[offset]) as Period;

export default () => {
    const defaultPeriod = [dayjs(dayjs().subtract(1, 'month')), dayjs(Date.now())] as Period;
    const [period, setPeriod] = useState<Period>(defaultPeriod);
    const start = period[0];
    const end = period[1];
    const issues: IssueVO[] = useSelector(ISSUES.selectAll);

    const periodIssues = issues.filter(Days.isIssueInPeriod(period));
    const activeIssues = periodIssues.filter(Days.isIssueActive);
    const outdatedIssues = periodIssues.filter(Days.isIssueOutdated);

    const closedIssues = periodIssues.filter(i => i.status === 'Выполнена');
    const openedIssues = activeIssues.filter(i => dayjs(i.registerDate).isBetween(start, end));
    const outdatedClosedIssues = outdatedIssues.filter(i => i.status === 'Выполнена' || i.status === 'Отменена');
    const outdatedOpenIssues = outdatedIssues.filter(i => i.status === 'В работе');

    const onOptionChange = (option: string) => {
        setPeriod(mapOffsetToPeriod(option));
    }

    return (
        <AppLayout
            hidePageContainer
            proLayout={{
                contentStyle: {
                    padding: '0px'
                }
            }}
        >
            <Card title="Графики">
                <Card.Grid hoverable={false} style={{width: '100%', height: '80px'}}>
                    <span style={{ paddingRight: '24px' }}>Период:</span>
                    <RangePicker
                        allowClear={false}
                        placeholder={['Дата начала', 'Дата конца']}
                        value={period || defaultPeriod}
                        onChange={setPeriod}
                    />
                    <span style={{ padding: '0 24px' }}>За период:</span>
                    <Select
                        onSelect={onOptionChange}
                        style={{width: '150px'}}
                        options={periodOptions}
                    />
                </Card.Grid>

                <Card.Grid hoverable={false} style={gridStyle} title={'Новые'}>
                    <b>Новые заявки</b>
                    <IssueChart issues={openedIssues} color={'green'}/>
                </Card.Grid>
                <Card.Grid hoverable={false} title={'Закрытые'} style={gridStyle}>
                    <b>Закрыто за период</b>
                    <IssueChart issues={closedIssues} color={'orange'}/>
                </Card.Grid>
                <Card.Grid hoverable={false} style={gridStyle} title={'Просрочено в закрытых'}>
                    <b>Просрочено в закрытых за период</b>
                    <IssueChart issues={outdatedClosedIssues} color={'blue'}/>
                </Card.Grid>
                <Card.Grid hoverable={false} style={gridStyle} title={'Просрочено в работе'}>
                    <b>Просрочено в работе в течении пероида</b>
                    <IssueChart issues={outdatedOpenIssues} color={'red'}/>
                </Card.Grid>
            </Card>
        </AppLayout>
    );
}