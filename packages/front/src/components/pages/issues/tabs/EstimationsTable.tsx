import { ISSUES } from 'iso/src/store/bootstrap';
import { roleEnum } from 'iso/src/store/bootstrap/repos/users';
import React, {
    useCallback,
    useMemo,
    useRef,
} from 'react';
import { AgGridReact } from 'ag-grid-react';

import {
    ColDef,
    ISelectCellEditorParams,
    RowEditingStartedEvent,
    RowEditingStoppedEvent
} from 'ag-grid-community';
import {
    DEPRECATED_issueEstimationStatusesList,
    ExpenseItem,
    IssueVO,
    paymentTypesList,
    purposeTypesList
} from 'iso/src/store/bootstrap/repos/issues';
import {
    Button,
    Select,
    Space,
    Typography
} from 'antd';
import {
    clone,
    remove
} from 'ramda';
import AG_GRID_LOCALE_RU from '../../../../grid/locale.ru';
import ImportTableButton from '../ImportTableButton';
import { DownloadOutlined } from '@ant-design/icons';
import useCurrentUser from '../../../../hooks/useCurrentUser';
import { useContextEditor } from '../../chapter-modal/useEditor';
import { ProForm } from '@ant-design/pro-components';
import { isUserIT } from '../../../../utils/userUtils';

const countEstimations = (expenses: IssueVO['estimations']) =>
    expenses.reduce((prev, item) => prev + (isNaN(Number(item.amount)) ? 0 : Number(item.amount)), 0);

export default () => {

    const {currentUser} = useCurrentUser();
    const canEdit = currentUser.role === roleEnum['руководитель']
        || currentUser.role === roleEnum['сметчик']
        || currentUser.role === roleEnum['менеджер'];
    const isITDepartment = isUserIT(currentUser);

    const editorProps = useContextEditor(ISSUES);
    const {item, params, getRenFieldProps, updateItemProperty, hasChanges, errors, isValid,} = editorProps;

    const initialItems = clone(item.estimations || []);
    const gridRef = useRef<AgGridReact>(null);
    const gridStyle = useMemo(() => ({height: '300px', width: '100%'}), []);
    const rowData = initialItems;
    const setRowData = (items: ExpenseItem[]) => {
        updateItemProperty('estimations')(items);//({...item, estimations: items, estimationPrice: countEstimations(items)})
    };

    const columnDefsIt = [
        {
            field: 'paymentType',
            headerName: 'Оплата',
            cellEditor: 'agSelectCellEditor',
            cellEditorParams: {
                values: [...paymentTypesList]
            } as ISelectCellEditorParams,
        },
        {
            field: 'purposeType',
            headerName: 'Назначение',
            cellEditor: 'agSelectCellEditor',
            width: 120,
            cellEditorParams: {
                values: [...purposeTypesList]
            } as ISelectCellEditorParams,
        },
        {field: 'title', headerName: 'Наименование', width: 140,},
        {field: 'amount', headerName: 'Доходы', cellEditor: 'agNumberCellEditor'},
        {
            field: 'date', headerName: 'Дата оплаты', cellEditor: 'agDateCellEditor', cellClass: 'dateISO'
        },
        {field: 'comment', headerName: 'Комментарий'},
        {
            cellRenderer: (props: { rowIndex: number }) =>
                <Button danger={true} onClick={() => {
                    setRowData(remove(props.rowIndex, 1, rowData));
                }}>Удалить</Button>
        }
    ];

    const columnDefsDefault = [
        {
            field: 'title', headerName: 'Наименование'
        },
        {
            field: 'amount', headerName: 'Доход', cellEditor: 'agNumberCellEditor',
        },
        {
            field: 'comment', headerName: 'Комментарий'
        },
        {
            cellRenderer: canEdit
                ? (props: { rowIndex: number }) =>
                    <Button danger={true} onClick={() => {
                        setRowData(remove(props.rowIndex, 1, rowData));
                    }}>Удалить</Button>
                : 'Смета'
        }
    ];

    const columnDefs = isITDepartment ? columnDefsIt : columnDefsDefault;
    const xlsxCols = columnDefs.filter(def => def.field).map(def => def.field);
    const defaultColDef = useMemo<ColDef>(() => {
        return {
            flex: 1,
            minWidth: 110,
            editable: canEdit,
            resizable: true,
        };
    }, []);

    const onCellEditingStarted = (e: RowEditingStartedEvent) => {
        console.log('RowEditingStartedEvent', e);
    };
    const onCellEditingStopped = (e: RowEditingStoppedEvent) => {
        let items: Array<ExpenseItem> = [];
        gridRef.current.api.forEachNode(function (node) {

            items.push(node.data);
        });
        setRowData(items);
        console.log('RowEditingStoppedEvent', e, items);
    };


    const onImport = async (items: ExpenseItem[]) => {
        console.log('onImport', items);
        setRowData(items);
    };
    const renderEstimationsStatus = (name: keyof IssueVO) => {
        return (
            <ProForm.Item
                label={ISSUES.properties[name].headerName}
                width={'sm'}
            >
                <Select
                    label={ISSUES.properties[name].headerName}
                    value={item[name]}
                    disabled={!canEdit}
                    onSelect={updateItemProperty(name)}
                    options={DEPRECATED_issueEstimationStatusesList.map(st => ({label: st, value: st}))}
                    style={{ width: 300 }}
                />
            </ProForm.Item>
        );
    };
    const onBtExport = useCallback(() => {
        gridRef.current!.api.exportDataAsExcel();
    }, []);

    return (
        <div>{
            canEdit
                ? <Typography.Text type={'success'}>Ваша роль {currentUser.role}, редактируйте смету</Typography.Text>
                : <Typography.Text type={'danger'}>Ваша роль {currentUser.role}, нельзя редактировать смету</Typography.Text>
        }
            {renderEstimationsStatus('estimationsStatus')}
            <div className="ag-theme-alpine" style={gridStyle}>
                <AgGridReact
                    localeText={AG_GRID_LOCALE_RU}
                    ref={gridRef}
                    rowData={rowData}
                    columnDefs={columnDefs}
                    defaultColDef={defaultColDef}
                    onCellEditingStarted={onCellEditingStarted}
                    onCellEditingStopped={onCellEditingStopped}
                />
            </div>
            <div style={{paddingTop: '8px', display: 'flex', justifyContent: 'space-between'}}>
                <Space>
                    {canEdit ? <> <ImportTableButton<ExpenseItem>
                            onImport={onImport}
                            sampleFileURL={'/assets/import-estimations-example.xlsx'}
                            xlsxCols={xlsxCols}
                            title={'Импорт сметы'}
                            imgURL={'/assets/import-estimations-example.png'}
                            importedItemsFound={'позиций в смете'}
                        ></ImportTableButton>

                            <Button type={'primary'} onClick={() => setRowData([...rowData, {}])}>Добавить
                                строку</Button></>
                        : <Typography.Text type={'danger'}>Ваша роль {currentUser.role}, нельзя редактировать смету</Typography.Text>
                    }
                    <Typography.Text>Итого: </Typography.Text>
                    <Typography.Text code strong>{item.estimationPrice}</Typography.Text>
                </Space>

                <Space>
                    <Button icon={<DownloadOutlined/>} onClick={onBtExport}>Скачать .xlsx</Button>
                </Space>
            </div>
        </div>
    );
}

