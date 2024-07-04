import {
    Card,
    Select,
    Space
} from 'antd';
import { IssueVO } from "iso/src/store/bootstrap/repos/issues";
import { FC, useEffect, useState } from "react"
import useLedger from "../../../../hooks/useLedger";
import { DefaultOptionType } from "antd/es/select";
import { employeeRoleEnum } from "iso/src/store/bootstrap/repos/employees";
import { roleEnum } from "iso/src/store/bootstrap/repos/users";
import { departmentOptions, SUBJ_FILTER, typeOptions, TYPES } from "./helpers";
import { ExpensesChart } from '../charts/ExpensesChart';

interface DashboardExpensesChartsProps {
    allIssues: IssueVO[];
    Filters: ({ children }: { children: React.ReactNode }) => JSX.Element,
    onSubFilterChange: (filterFunction: () => boolean) => void;
}

export const DashboardExpensesCharts: FC<DashboardExpensesChartsProps> = ({
    allIssues,
    Filters,
    onSubFilterChange,
}) => {
    const [type, setType] = useState(TYPES.department);
    const [subject, setSubject] = useState(null);
    const [subjectOptions, setSubjectOptions] = useState(null);

    const ledger = useLedger();

    useEffect(() => {
        let _subjectOptions: DefaultOptionType[] = [];

        switch (type) {
            case TYPES.tech: {
                const techs = ledger.employees.list.filter(e => e.role === employeeRoleEnum['техник']);

                _subjectOptions = techs.map(t => ({
                    label: `${t.name} ${t.lastname || ''}`,
                    value: t.employeeId,
                }));
                break;
            }
            case TYPES.manager: {
                const managers = ledger.users.list.filter(u => u.role === roleEnum['менеджер']);

                _subjectOptions = managers.map(t => ({
                    label: `${t.name} ${t.lastname || ''}`,
                    value: t.userId,
                }));
                break;
            }
            case TYPES.department: {
                _subjectOptions = departmentOptions;
                break;
            }
            case TYPES.brand: {
                const brands = ledger.brands.list;

                _subjectOptions = brands.map(b => ({
                    label: b.brandName,
                    value: b.brandId,
                }));
            }
        }

        setSubject(null);
        setSubjectOptions(_subjectOptions);
    }, [type]);

    const subjectFilter = subject ? SUBJ_FILTER[type](subject, ledger) : (() => true);

    useEffect(() => {
        onSubFilterChange(subjectFilter);
    }, [subject]);

    const fAll = allIssues.filter(subjectFilter);
    
    return (
        <div style={{ display: 'flex', gap: 24, width: '100%' }}>
            <Filters>
                <Space>
                    <Select
                        defaultValue={type}
                        style={{width: '150px'}}
                        options={typeOptions}
                        onSelect={setType}
                    />
                    <Select
                        virtual
                        showSearch
                        value={subject}
                        optionFilterProp="label"
                        style={{width: '250px'}}
                        options={subjectOptions}
                        onSelect={setSubject}
                    />
                </Space>
            </Filters>
            {type && subject && (
                <div style={{ textAlign: 'center', flexGrow: 1 }}>
                    <Card.Grid hoverable={false}>
                        <ExpensesChart 
                            allIssues={fAll}
                        />
                    </Card.Grid>
                </div>
            )}
        </div>
    )
}