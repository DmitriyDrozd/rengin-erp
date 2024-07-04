import dayjs, { Dayjs } from 'dayjs';
import { IssueVO } from '../store/bootstrap/repos/issues';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isToday from 'dayjs/plugin/isToday';
import isBetween from 'dayjs/plugin/isBetween';
import { ExpenseVO } from '../store/bootstrap/repos/expenses';

type ConfigType = string | Date | Dayjs | null | undefined

export const GENERAL_DATE_FORMAT = 'DD-MM-YYYY HH:mm:ss';
export const FORMAT_MONTH_YEAR = 'MMMM YYYY';

function dayjsToString() {
    return this.format(GENERAL_DATE_FORMAT);
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

export const asMonthYear = (value: string | Date) =>
    value ? dayjs(value).locale('ru').format('MMMM YYYY') : undefined;

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
        plannedDate: asDay(issue.plannedDate),
        completedDate: asDay(issue.completedDate),
        workStartedDate: asDay(issue.workStartedDate),
        registerDate: asDay(issue.registerDate)
    };
};


export const getIssueDelayOrUndefined = (issue: IssueVO) => {
    const {plannedDate, completedDate, registerDate, workStartedDate} = getIssueDays(issue);

    // console.log(plannedDate ? plannedDate.toString() : '-', completedDate ? completedDate.toString() : '-');
    if (plannedDate) {
        const endDay = asDayOrToday(issue.completedDate);

        if (endDay.isAfter(plannedDate))
            return endDay.diff(plannedDate, 'day');
    }
    if (completedDate)
        return 0;
    return 0;
};

export const isIssuePaused = (issue: IssueVO) => {
    return issue.status === 'Приостановлена';
}

export const isIssueInWork = (issue: IssueVO) => {
    return issue.status === 'В работе';
}

export const isIssueActive = (issue: IssueVO) => {
    return issue.status !== 'Отменена' && issue.status !== 'Приостановлена';
};


export const isIssueOutdated = (issue: IssueVO) =>
    getIssueDelayOrUndefined(issue) > 0;

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

export const isDateFRPropInPeriod = (period: Period, includeUndefined: boolean = false) =>
    (estimation: ExpenseVO) => {
        if (!estimation.dateFR) {
            return includeUndefined;
        }

        const day = dayjs(estimation.dateFR);
        return day.isInPeriod(period);
    }

export const isRegisteredIn = isDayPropInPeriod('registerDate');
export const isCompletedIn = isDayPropInPeriod('completedDate');
export const isWorkStartedIn = isDayPropInPeriod('workStartedDate');
export const isPlannedIn = isDayPropInPeriod('plannedDate');

const anyIssueDayInPeriod = (period: Period) => (issue: IssueVO) => {
    return isRegisteredIn(period)(issue) ||
        isCompletedIn(period)(issue) ||
        isPlannedIn(period)(issue) ||
        isWorkStartedIn(period)(issue);
};

export const isIssueInPeriod = (period: Period) => (issue: IssueVO) => {
    return anyIssueDayInPeriod(period)(issue);
    // if (anyIssueDayInPeriod(period)(issue)) {
    //     return true;
    // }
    //
    // const { completedDate, registerDate } = getIssueDays(issue);
    // return !completedDate && registerDate && registerDate.isBefore(period[1]);
};

export const isEstimationInPeriod = (period: Period) => (estimation: ExpenseVO) => {
    return isDateFRPropInPeriod(period)(estimation);
};

export const toDayString = (d: ConfigType) =>
    d ? asDayOrToday(d).toString() : 'Дата не указана';