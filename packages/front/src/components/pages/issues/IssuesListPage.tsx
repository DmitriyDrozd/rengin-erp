import { useAllColumns } from '../../../grid/RCol';
import PanelRGrid from '../../../grid/PanelRGrid';
import {
    ISSUES,
    IssueVO,
    statusesColorsMap,
    statusesList
} from 'iso/src/store/bootstrap/repos/issues';
import AppLayout from '../../app/AppLayout';
import React from 'react';
import { ColDef } from 'ag-grid-community';
import {
    Badge,
    Button,
    Checkbox,
    Space,
    Tag
} from 'antd';
import { NewValueParams } from 'ag-grid-community/dist/lib/entities/colDef';
import {
    useDispatch,
    useSelector
} from 'react-redux';
import useCurrentUser from '../../../hooks/useCurrentUser';
import { useRouteMatch } from 'react-router';
import { getNav } from '../../getNav';
import IssueModal_NEW from './IssueModal_NEW';
import dayjs from 'dayjs';
import useLocalStorageState from '../../../hooks/useLocalStorageState';
import StatusFilterSelector from './StatusFilterSelector';
import { isIssueOutdated } from 'iso/src/utils/date-utils';
import IsssueStatusCellEditor from './IsssueStatusCellEditor';
import { ClockCircleOutlined } from '@ant-design/icons';
import { AntdIcons } from '../../elements/AntdIcons';
import axios from 'axios';
import ImportIssuesButton from './import-gsheet/ImportIssuesButton.js';
import { Link } from 'react-router-dom'

const getEstimationApprovedTag = (data: IssueVO) =>
    data.estimationsApproved === true
        ? <Tag color={'green'}>Да</Tag>
        : <Tag color={'red'}>Нет</Tag>;

const getStatusTag = (issue: IssueVO) => {
    const currentDJ = dayjs();
    const plannedDJ = issue.plannedDate ? dayjs(issue.plannedDate) : undefined;
    // const completedDJ = issue.completedDate ? dayjs(issue.completedDate) : undefined;

    // const workStartedDJ = issue.workStartedDate ? dayjs(issue.workStartedDate) : undefined;
    // const registerDJ = issue.registerDate ? dayjs(issue.registerDate) : undefined;
    const getTag = () => {
        return <Tag color={statusesColorsMap[issue.status]}>{issue.status}</Tag>;
    };
    let node = getTag();
    if (issue.status === 'В работе') {
        if (currentDJ.isAfter(plannedDJ))
            node = <Badge count={currentDJ.diff(plannedDJ, 'd')} offset={[8, 12]}>{node}</Badge>;
    }
    if (issue.status === 'Выполнена') {
        if (issue.plannedDate && issue.completedDate) {
            if (dayjs(issue.completedDate).isAfter(issue.plannedDate))
                node = <Badge color={'lightpink'} count={dayjs(issue.completedDate).diff(dayjs(issue.plannedDate), 'd')}
                              offset={[-2, 5]}>{node}</Badge>;
        }
        if (!issue.plannedDate || !issue.completedDate) {
            node = <Badge count={<ClockCircleOutlined style={{color: '#d5540a'}}/>} offset={[5, 10]}>{node}</Badge>;
        }
    }
    return <>{node}</>;
};


export default () => {

    const routeMatch = useRouteMatch<{
        issueId: string
    }>();

    const currentItemId = window.location.hash === '' ? undefined : window.location.hash.slice(1);
    console.log('RouteMatch ', routeMatch);
    const allIssues: IssueVO[] = useSelector(ISSUES.selectAll);
    const {currentUser} = useCurrentUser();

    const dispatch = useDispatch();
    const onCreateClick = (defaults) => {
        console.log(defaults);
    };
    const [cols, colMap] = useAllColumns(ISSUES);

    const columns: ColDef<IssueVO>[] = [
        {...colMap.clickToEditCol, headerName: 'id'},
        {...colMap.clientsNumberCol},
        {...colMap.registerDate, width: 150},
        {
            field: 'status',
            filter: 'agSetColumnFilter',
            filterParams: {
                applyMiniFilterWhileTyping: true,
            },
            headerName: 'Статус',
            width: 125,
            editable: currentUser.role !== 'сметчик',
            onCellValueChanged: (event: NewValueParams<IssueVO, IssueVO['status']>) => {
                const issue: Partial<IssueVO> = {issueId: event.data.issueId, status: event.newValue};
                if (event.newValue === 'Выполнена')
                    issue.completedDate = dayjs().startOf('d').toISOString();

                dispatch(ISSUES.actions.patched(issue));
            },
            cellEditor: IsssueStatusCellEditor,
            cellEditorParams: {
                values: (params) => [params.data.status, 'sd'],// ['Новая','В работе','Выполнена','Отменена','Приостановлена'],
                valueListGap: 0,
            },
            cellRenderer: (props: {
                rowIndex: number
            }) =>
                getStatusTag(props.data)
        },
        {...colMap.brandId, width: 150},
        {...colMap.siteId, width: 250},
        {...colMap.description, width: 350},
        {...colMap.plannedDate, headerName: 'План'},
        {...colMap.completedDate, headerName: 'Завершена', width: 115},
        {
            ...colMap.estimationsApproved,
            headerName: 'Смета',
            cellRenderer: (props) =>
                getEstimationApprovedTag(props.data)
            , width: 80
        },
        {...colMap.estimationPrice, editable: false, width: 130},
        {...colMap.expensePrice, editable: false, width: 100},
    ] as ColDef<IssueVO>[];

    const [statuses, setStatuses] = useLocalStorageState('statusFilter', statusesList);
    const [outdated, setOutdated] = useLocalStorageState('outdatedFilter', false);

    const outdatedIssues = outdated ? allIssues.filter(i => isIssueOutdated(i) && !(i.status === 'Выполнена' && !i.completedDate)) : allIssues;

    const dataForUser = currentUser.role === 'менеджер'
        ? outdatedIssues.filter(i => i.managerUserId === currentUser.userId)
        : outdatedIssues;

    console.log('statuses', statuses);
    // const gridRef = useRef<AgGridReact<IssueVO>>(null);
    const rowData = dataForUser.filter(s => statuses.includes(s.status));

    return <AppLayout
        hidePageContainer={true}
        proLayout={{
            contentStyle: {
                padding: '0px'
            }
        }}
    >
        <div>
            {
                currentItemId ? <IssueModal_NEW id={currentItemId}/> : null
            }


            <PanelRGrid

                toolbar={<Space>
                    <Checkbox checked={outdated} onChange={e => setOutdated(e.target.checked)}>Просроченные</Checkbox>
                    <StatusFilterSelector statuses={statuses} setStatuses={setStatuses}/>
                </Space>}
                rowData={rowData}
                onCreateClick={onCreateClick}
                fullHeight={true}
                resource={ISSUES}
                columnDefs={columns}
                title={'Все заявки'}
                bottomBar={({ag}) => {
                    const onEmailExport = async () => {
                        //  const email = prompt('Укажите почтовый ящик, куда нужн отправить выгрузку')
                        const blob = ag.api.getDataAsExcel({}) as any as Blob;
                        //const api = await getRestApi()
                        const formData = new FormData();
                        formData.append('file[]', blob, 'report.xlsx');
                        const response = await axios.post(
                            '/api/email-export?images=true&email=',
                            formData,
                            {
                                headers: {
                                    'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
                                },
                            });//?email=miramaxis@ya.ru&images=true', formData);
                        console.log(response.data);

                        const url = response.data.url;
                        const element = document.createElement('a');
                        element.href = url;
                        element.download = url;
// simulate link click
                        document.body.appendChild(element); // Required for this to work in FireFox
                        element.click();
                        document.body.removeChild(element);

                    };

                    return (
                        <Space>
                            <Button icon={<AntdIcons.MailTwoTone/>} onClick={onEmailExport}>
                                Выгрузить заявки
                            </Button>
                            <Link to={getNav().importIssues}>
                                <Button icon={<AntdIcons.UploadOutlined/>}>
                                    Импортировать заявки
                                </Button>
                            </Link>
                            <ImportIssuesButton/>
                        </Space>
                    );
                }}
            />
            {
                /**
                 <FooterToolbar extra="extra information">
                 <Button>Cancel</Button>
                 <Button type="primary">Submit</Button>
                 </FooterToolbar>
                 */
            }</div>

    </AppLayout>;

}