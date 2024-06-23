import {
    Card,
    Select,
    Space
} from 'antd';
import { DefaultOptionType } from 'antd/es/select';
import {
    employeeRoleEnum,
} from 'iso/src/store/bootstrap/repos/employees';
import { IssueVO } from 'iso/src/store/bootstrap/repos/issues';
import {
    roleEnum,
} from 'iso/src/store/bootstrap/repos/users';
import React, {
    useEffect,
    useState
} from 'react';
import useLedger from '../../../../hooks/useLedger';
import { IssuesPerformance } from '../charts/IssuesPerformance';

const TYPES = {
    department: 'department',
    manager: 'manager',
    tech: 'tech',
};

const typeOptions: DefaultOptionType[] = [
    {
        label: 'Отдел',
        value: TYPES.department
    },
    {
        label: 'Менеджер',
        value: TYPES.manager
    },
    {
        label: 'Техник',
        value: TYPES.tech
    },
];

const DEPS = {
    build: 'строительный',
    estimator: 'сметный',
    service: 'сервисный',
    IT: 'ИТ',
};

const departmentOptions = [
    {value: DEPS.build, label: 'строительный'},
    {value: DEPS.estimator, label: 'сметный'},
    {value: DEPS.service, label: 'сервисный'},
    {value: DEPS.IT, label: 'ИТ'},
];

const techFilter = (techId: string) => (issue: IssueVO) => issue.techUserId === techId;
const managerFilter = (managerId: string) => (issue: IssueVO) => issue.managerUserId === managerId;
const departmentFilter = (department: string, ledger: any) => (issue: IssueVO) => {
    const isManagerInDep = ledger.users.byId[issue.managerUserId]?.department === department;
    const isEstimatorInDep = ledger.users.byId[issue.estimatorUserId]?.department === department;

    return isManagerInDep || isEstimatorInDep;
};

const SUBJ_FILTER = {
    [TYPES.tech]: techFilter,
    [TYPES.manager]: managerFilter,
    [TYPES.department]: departmentFilter,
};

export const DashboardPerformanceCharts = (
    {
        Filters,
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
        }

        setSubject(null);
        setSubjectOptions(_subjectOptions);
    }, [type]);

    const subjectFilter = subject ? SUBJ_FILTER[type](subject, ledger) : (() => true);

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