import React, { useEffect, useState } from "react";
import Form from "antd/es/form";

import ISSUES, { IssueVO, paymentTypes, purposeTypes, TExpense } from "iso/src/store/bootstrap/repos/issues";
import RenField from "../../../form/RenField";
import { NumericInput } from "../../../elements/NumericInput";

interface IFinanceSimplifiedProps {
    issue: IssueVO;
    onChange: (prop: string) => (value: any) => void;
}

export const FinanceSimplified = ({ issue, onChange }: IFinanceSimplifiedProps) => {
    // Исходим из того, что у ИТ-отдела нету вкладки Расходы, а значит каждого расхода может быть только одна запись
    // todo: Для заявок, к которым привязан менеджер не из ИТ-отдела, поле должно быть не редактируемым, чтобы не потерять записи

    const onChangeExpense = (purposeType: string) => (value: string) => {
        const amount = isNaN(+value) ? 0 : +value;

        const newExpenses = [...issue.expenses];
        const purposeIndex = issue.expenses.findIndex(e => e.purposeType === purposeType);

        if (purposeIndex !== -1) {
            newExpenses[purposeIndex] = {
                ...newExpenses[purposeIndex],
                amount,
            };
        } else {
            newExpenses.push({
                purposeType,
                amount,
                paymentType: paymentTypes.cashless,
                comment: 'Сумма по типу расхода',
            } as any);
        }

        onChange('expenses')(newExpenses);
    }

    const findExpense = (purposeType: string): string => issue.expenses.find(e => e.purposeType === purposeType)?.amount.toString() || '';

    const expenses = {
        material: findExpense(purposeTypes.material),
        service: findExpense(purposeTypes.service),
        gsm: findExpense(purposeTypes.gsm),
        other: findExpense(purposeTypes.other),
    }

    return (
        <>
            <RenField meta={ISSUES.properties.estimationPrice} label="Доход" width={'sm'}/>
            <Form.Item label={purposeTypes.material + ' расход'}>
                <NumericInput
                    value={expenses.material}
                    onChange={onChangeExpense(purposeTypes.material)}
                />
            </Form.Item>
            <Form.Item label={purposeTypes.service + ' расход'}>
                <NumericInput
                    value={expenses.service}
                    onChange={onChangeExpense(purposeTypes.service)}
                />
            </Form.Item>
            <Form.Item label={purposeTypes.gsm + ' расход'}>
                <NumericInput
                    value={expenses.gsm}
                    onChange={onChangeExpense(purposeTypes.gsm)}
                />
            </Form.Item>
            <Form.Item label={purposeTypes.other + ' расход'}>
                <NumericInput
                    value={expenses.other}
                    onChange={onChangeExpense(purposeTypes.other)}
                />
            </Form.Item>
        </>
    );
}