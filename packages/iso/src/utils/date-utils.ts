import dayjs, { Dayjs } from 'dayjs';
import { IssueVO } from '../store/bootstrap/repos/issues';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isToday from 'dayjs/plugin/isToday';
import isBetween from 'dayjs/plugin/isBetween';

type ConfigType = string | Date | Dayjs | null | undefined

function dayjsToString() {
    return this.format('YYYY/MM/DD');
}

declare module 'dayjs' {
    interface Dayjs {
        isInPeriod(period: Period): boolean;
    }
}

const isInPeriod = (o, c, d: typeof dayjs) => {
    c.prototype.toString = dayjsToString,
        c.prototype.isInPeriod = function ([start, end]: Period) {
            const day = this as Dayjs;
            if (!start && !end)
                return true;
            if (!end)
                return (this as Dayjs).isAfter(start, 'day') || day.isSame(start);
            if (!start)
                return (this as Dayjs).isBefore(end, 'day') || day.isSame(end);
            return (this as Dayjs).isBetween(start, end, 'day', '[]');
        };
};

export type Period = [Dayjs | null, Dayjs | null]
export type Day = Dayjs


dayjs.extend(isBetween);
dayjs.extend(isInPeriod);
dayjs.extend(isSameOrAfter);
dayjs.extend(isToday);

export const asDay = (value: string | Date | Day) =>
    value ? dayjs(value).startOf('d') : undefined;

const calcToday = () =>
    dayjs().startOf('d');

var _today = calcToday();
var _lastTodayCall = new Date().getTime();


export const today = () => {
    if (_lastTodayCall + 1000 * 60 > new Date().getTime()) {
        _today = calcToday();
        _lastTodayCall = new Date().getTime();
    }
    return _today;
};

export const asDayOrToday = (value: ConfigType) =>
    (!value) ? today() : asDay(value);

export const asDayOrUndefined = (value: ConfigType) =>
    value === undefined ? undefined : asDay(value);

export const getIssueDays = (issue: IssueVO) => {
    return {
        plannedDay: asDay(issue.plannedDate),
        completedDay: asDay(issue.completedDate),
        workStartedDay: asDay(issue.workStartedDate),
        registerDay: asDay(issue.registerDate)
    };
};


export const getIssueDelayOrUndefined = (issue: IssueVO) => {
    const {plannedDay, completedDay, registerDay, workStartedDay} = getIssueDays(issue);

    console.log(plannedDay ? plannedDay.toString() : '-', completedDay ? completedDay.toString() : '-');
    if (plannedDay) {
        const endDay = asDayOrToday(issue.completedDate);

        if (endDay.isAfter(plannedDay))
            return endDay.diff(plannedDay, 'day');
    }
    if (completedDay)
        return 0;
    return 0;
};

export const isIssueActive = (issue: IssueVO) => {
    if (issue.status === 'Отменена' || issue.status === 'Приостановлена')
        return false;
    return true;
};


export const isIssueOutdated = (issue: IssueVO) =>
    getIssueDelayOrUndefined(issue) > 0;

export const isIssueDelayed = isIssueOutdated;

export type DayProp = keyof ReturnType<typeof getIssueDays>

export const isDayPropInPeriod = (prop: DayProp) =>
    (period: Period, includeUndefined: boolean = false) =>
        (issue: IssueVO) => {

            if (!issue[prop]) {
                return includeUndefined;
            }
            const day = dayjs(issue[prop]);
            return day.isInPeriod(period);
        };
export const isRegisteredIn = isDayPropInPeriod('registerDay');
export const isCompletedIn = isDayPropInPeriod('completedDay');
export const isWorkStartedIn = isDayPropInPeriod('workStartedDay');
export const isPlannedIn = isDayPropInPeriod('plannedDay');

const anyIssueDayInPeriod = (period: Period) => (issue: IssueVO) => {
    return isRegisteredIn(period)(issue) ||
        isCompletedIn(period)(issue) ||
        isPlannedIn(period)(issue) ||
        isWorkStartedIn(period)(issue);
};

export const isIssueInPeriod = (period: Period) => (issue: IssueVO) => {
    if (anyIssueDayInPeriod(period)(issue)) {
        return true;
    }

    const {
        plannedDay,
        completedDay,
        registerDay,
        workStartedDay
    } = getIssueDays(issue);
    const end = asDayOrToday(period[1]);

    return !completedDay && registerDay && registerDay.isBefore(today());
};


export const toDayString = (d: ConfigType) =>
    d ? asDayOrToday(d).toString() : 'Дата не указана';