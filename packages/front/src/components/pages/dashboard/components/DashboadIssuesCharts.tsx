import {
    Card,
    Select
} from 'antd';
import React, {
    FC,
    useEffect,
    useState
} from 'react';
import Space from 'antd/es/space';
import { departmentOptions, PERIOD_TYPE, SUBJ_FILTER, typeOptions, TYPES } from './helpers';
import useLedger from '../../../../hooks/useLedger';
import { DefaultOptionType } from 'antd/es/select';
import { roleEnum } from 'iso/src/store/bootstrap/repos/users';
import { IssuesByDateChart } from '../charts/IssuesByDate';
import { IssueVO } from 'iso/src/store/bootstrap/repos/issues';

const issuesOptions = typeOptions.filter(to => to.value !== TYPES.tech);

interface DashboadIssuesChartsProps {
    allIssues: IssueVO[];
    periodType: PERIOD_TYPE;
    Filters: ({ children }: { children: React.ReactNode }) => JSX.Element,
    onSubFilterChange: (filterFunction: (issue: IssueVO) => boolean) => void;
    performance?: any;
}

export const DashboadIssuesCharts: FC<DashboadIssuesChartsProps> = (
    {
        allIssues,
        periodType,
        Filters,
        onSubFilterChange,
        performance,
    }
) => {
    const [type, setType] = useState(TYPES.manager);
    const [subject, setSubject] = useState(null);
    const [subjectOptions, setSubjectOptions] = useState(null);
    const ledger = useLedger();

    useEffect(() => {
        let _subjectOptions: DefaultOptionType[] = [];

        switch (type) {
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

    const typeFilter = type ? SUBJ_FILTER[type] : () => true;
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
                        options={issuesOptions}
                        onSelect={setType}
                    />
                    <Select
                        virtual
                        showSearch
                        allowClear
                        value={subject}
                        optionFilterProp="label"
                        style={{width: '250px'}}
                        options={subjectOptions}
                        onClear={() => setSubject(null)}
                        onSelect={setSubject}
                    />
                </Space>
            </Filters>
            {type && !subject && (
                <div style={{ textAlign: 'center', flexGrow: 1 }}>
                    <Card.Grid hoverable={false}>
                        <IssuesByDateChart
                            periodType={periodType}
                            typeFilter={typeFilter}
                            subjectOptions={subjectOptions}
                            allIssues={fAll}
                        />
                    </Card.Grid>
                </div>
            )}
            {type && subject && (
                <div style={{ textAlign: 'center', flexGrow: 1 }}>
                    <Card.Grid hoverable={false}>
                        <IssuesByDateChart
                            periodType={periodType}
                            typeFilter={typeFilter}
                            subjectFilter={subjectFilter}
                            subject={subject}
                            subjectOptions={subjectOptions}
                            allIssues={fAll}
                            performance={performance}
                        />
                    </Card.Grid>
                </div>
            )}
        </div>
    );
};