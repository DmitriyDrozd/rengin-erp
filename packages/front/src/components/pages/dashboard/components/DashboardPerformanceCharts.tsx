import {
    Card,
    Select,
    Space
} from 'antd';
import { DefaultOptionType } from 'antd/es/select';
import {
    employeeRoleEnum,
} from 'iso/src/store/bootstrap/repos/employees';
import {
    roleEnum,
} from 'iso/src/store/bootstrap/repos/users';
import React, {
    FC,
    useEffect,
    useState
} from 'react';
import useLedger from '../../../../hooks/useLedger';
import { IssuesPerformance } from '../charts/IssuesPerformance';
import { departmentOptions, SUBJ_FILTER, typeOptions, TYPES } from './helpers';
import { IssuesByDateChart } from '../charts/IssuesByDate';

export const DashboardPerformanceCharts: FC<any> = (
    {
        Filters,
        onSubFilterChange,
        allIssues,
        inWorkIssues,
        pausedIssues,
        closedIssues,
        outdatedClosedIssues,
        outdatedOpenIssues,
    }
) => {
    const [type, setType] = useState(TYPES.department);
    const [subject, setSubject] = useState(null);
    const [subjectOptions, setSubjectOptions] = useState(null);

    const ledger = useLedger();

    const updateSubjectOptions = () => {
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
    };

    useEffect(updateSubjectOptions, [type]);
    useEffect(updateSubjectOptions, []);

    const typeFilter = type ? SUBJ_FILTER[type] : () => true;
    const subjectFilter = subject ? SUBJ_FILTER[type](subject, ledger) : (() => true);

    useEffect(() => {
        onSubFilterChange(subjectFilter);
    }, [subject]);

    const fAll = allIssues.filter(subjectFilter);
    const fInWork = inWorkIssues.filter(subjectFilter);
    const fPaused = pausedIssues.filter(subjectFilter);
    const fClosed = closedIssues.filter(subjectFilter);
    const fOutdatedClosed = outdatedClosedIssues.filter(subjectFilter);
    const fOutdatedOpen = outdatedOpenIssues.filter(subjectFilter);

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
                        allowClear
                        value={subject}
                        optionFilterProp="label"
                        style={{width: '250px'}}
                        options={subjectOptions}
                        onSelect={setSubject}
                        onClear={() => setSubject(null)}
                    />
                </Space>
            </Filters>
            {type && !subject && (
                <div style={{ textAlign: 'center', flexGrow: 1 }}>
                <Card.Grid hoverable={false}>
                    <IssuesByDateChart
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
                        <IssuesPerformance
                            allIssues={fAll}
                            inWorkIssues={fInWork}
                            pausedIssues={fPaused}
                            closedIssues={fClosed}
                            outdatedClosedIssues={fOutdatedClosed}
                            outdatedOpenIssues={fOutdatedOpen}
                        />
                    </Card.Grid>
                </div>
            )}
        </div>
    );
};