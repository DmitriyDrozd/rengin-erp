import BRANDS from 'iso/src/store/bootstrap/repos/brands';
import { IssueVO } from 'iso/src/store/bootstrap/repos/issues';
import { asMonthYear } from 'iso/src/utils/date-utils';
import { useState } from 'react';
import { useSelector } from 'react-redux';

export const useMonthFilter = (data: IssueVO[]) => {
    const monthesFR: { [month: string]: string } = data.reduce((acc, item) => {
        if (!item.dateFR) {
            return acc;
        }

        const dateFR = item.dateFR.slice(0, 7);
        const monthFR = asMonthYear(dateFR);

        return {
            ...acc,
            [dateFR]: monthFR,
        };
    }, {});

    const monthFRFilterOptions = Object.keys(monthesFR).sort().reverse().map(o => ({ value: o, label: monthesFR[o] }))
    const [monthFRFilter, setMonthFRFilter] = useState(null);

    const resetMonthFRFilter = () => setMonthFRFilter(null);
    const filterByFRMonth = !!monthFRFilter ? (s: IssueVO) => s.dateFR?.startsWith(monthFRFilter) : () => true;

    return {
        monthFRFilter,
        monthFRFilterOptions,
        setMonthFRFilter,
        resetMonthFRFilter,
        filterByFRMonth,
    }
};

export const useCustomerFilter = (data: IssueVO[]) => {
    const brands = useSelector(BRANDS.selectAll);

    const customersList: { [customerId: string]: string } = data.reduce((acc: { [customerId: string]: string }, item) => {
        if (!item.brandId || !!acc[item.brandId]) {
            return acc;
        }

        return {
            ...acc,
            [item.brandId]: brands.find(b => b.brandId === item.brandId)?.brandName,
        };
    }, {});

    const customersFilterOptions = Object.keys(customersList).map(o => ({ value: o, label: customersList[o] }));
    const [customersFilter, setCustomersFilter] = useState(null);

    const resetCustomersFilter = () => setCustomersFilter(null);
    const filterByCustomer = !!customersFilter ? (s: IssueVO) => s.brandId === customersFilter : () => true;

    return {
        customersFilter,
        customersFilterOptions,
        setCustomersFilter,
        resetCustomersFilter,
        filterByCustomer,
    }
};

