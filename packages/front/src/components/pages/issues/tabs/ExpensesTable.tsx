import React, {
    useCallback,
    useMemo,
    useRef
} from 'react';
import { AgGridReact } from 'ag-grid-react';
import {
    ColDef,
    ISelectCellEditorParams,
    RowEditingStartedEvent,
    RowEditingStoppedEvent
} from 'ag-grid-community';
import 'ag-grid-enterprise';
import { generateGuid } from '@sha/random';

import {
    ExpenseItem,
    EstimationItem,
    ISSUES,
    IssueVO,
    paymentTypes,
    paymentTypesList,
    purposeTypesList
} from 'iso/src/store/bootstrap/repos/issues';
import {
    Button,
    Space,
    Typography
} from 'antd';
import {
    clone,
    remove,
    update
} from 'ramda';
import AG_GRID_LOCALE_RU from '../../../../grid/locale.ru';
import ImportTableButton from '../ImportTableButton';
import { DownloadOutlined } from '@ant-design/icons';
import { useCanManage } from '../../../../hooks/useCanManage';
import useCurrentUser from '../../../../hooks/useCurrentUser';
import { useContextEditor } from '../../chapter-modal/useEditor';
import { isUserIT } from '../../../../utils/userUtils';
import { useTheme } from '../../../../hooks/useTheme';


export default (props) => {
    const { theme } = useTheme();
    const {currentUser} = useCurrentUser();
    const {errors, item, getRenFieldProps, updateItemProperty, updateItemProperties, params, editor, hasChanges, resource, rules} = useContextEditor(ISSUES);
    const isITDepartment = isUserIT(currentUser);

    const canEdit = useCanManage();
    const rowData = clone(item.expenses || []);
    const gridRef = useRef<AgGridReact>(null);
    const containerStyle = useMemo(() => ({width: '100%', height: '100%'}), []);
    const gridStyle = useMemo(() => ({height: '300px', width: '100%'}), []);

    const setRowData = (items: ExpenseItem[], updatedItem: ExpenseItem) => {
        if (!isITDepartment) {
            updateItemProperty('expenses')(items);
        } else {
             /**
            * ИТ-отдел
            * Копирование создаваемых расходов во вкладку доходы
            * 
            * amount не должен помещаться в дубликат
            */
            const duplicateIndex = item.estimations.findIndex((item) => item.id === updatedItem.id);
            const isItemRemoved = items.findIndex(item => item.id === updatedItem.id) === -1;

            let estimationsUpdate = [...item.estimations, updatedItem];

            if (duplicateIndex > -1) {
                if (isItemRemoved) {
                    estimationsUpdate = remove(duplicateIndex, 1, item.estimations);
                } else {
                    /** 
                     * возможно не понравится, что комментарии и остальные поля будут затирать уже заполненные в доходах
                     * в таком случае раскоментить поля, которые затираются
                    */
                    const duplicateItem = item.estimations[duplicateIndex];
                    const itemToUpdate = {
                        ...updatedItem,
                        amount: duplicateItem.amount || undefined,
                        // comment: duplicateItem.comment || updatedItem.comment,
                        // paymentType: duplicateItem.paymentType || updatedItem.paymentType,
                        // purposeType: duplicateItem.purposeType || updatedItem.purposeType,
                        // title: duplicateItem.title || updatedItem.title,
                        // date: duplicateItem.date || updatedItem.date,
                    };

                    estimationsUpdate = update(duplicateIndex, itemToUpdate, item.estimations);
                }
            } else {
                if (isItemRemoved) {
                    estimationsUpdate = item.estimations;
                }
            }

            updateItemProperties([
                { prop: 'expenses', value: items },
                { prop: 'estimations', value: estimationsUpdate }
            ])
        }
    };

    const columnDefs = [
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
        {field: 'amount', headerName: 'Расходы', cellEditor: 'agNumberCellEditor',},
        {field: 'date', headerName: 'Дата оплаты', cellEditor: 'agDateCellEditor', cellClass: 'dateISO'},
        {field: 'comment', headerName: 'Комментарий'},
        {
            cellRenderer: (props: { rowIndex: number }) =>
                (
                    <Button 
                        danger={true} 
                        onClick={() => {
                            setRowData(remove(props.rowIndex, 1, rowData), rowData[props.rowIndex]);
                        }}
                    >
                        Удалить
                    </Button>
                )
        }
    ];

    const xlsxCols = columnDefs.filter(def => def.field).map(def => def.field);
    const defaultColDef = useMemo<ColDef>(() => {
        return {
            flex: 1,
            minWidth: 110,
            editable: canEdit,
            resizable: true,
        };
    }, []);

    const handleAddRow = () => {
        const newItem = {
            id: generateGuid(3),
            paymentType: paymentTypes.cash,
            purposeType: 'Материалы'
        }

        const expenseItems = clone(item.expenses || []);
        const expensesUpdate = [
            newItem,
            ...expenseItems,
        ];

        setRowData(expensesUpdate, newItem);
    }

    const onCellEditingStarted = (e: RowEditingStartedEvent) => {
        console.log('RowEditingStartedEvent', e);
    };
    const onCellEditingStopped = (e: RowEditingStoppedEvent) => {
        let items: Array<ExpenseItem> = [];
        gridRef.current.api.forEachNode(function (node) {
            items.push(node.data);
        });
        setRowData(items, e.data);
        console.log('RowEditingStoppedEvent', e, items);
    };


    const onImport = async (items: ExpenseItem[]) => {
        console.log('onImport', items);
        setRowData(items);
    };

    const onBtExport = useCallback(() => {
        gridRef.current!.api.exportDataAsExcel();
    }, []);

    return (<div>
        {
            canEdit
                ? <Typography.Text type={'success'}>Ваша роль {currentUser.role}, редактируйте смету</Typography.Text>
                : <Typography.Text type={'danger'}>Ваша роль {currentUser.role}, нельзя редактировать смету</Typography.Text>
        }
        <div className="ag-theme-alpine" style={gridStyle}>
            <AgGridReact
                theme={theme}
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
                {canEdit ? <>
                        <ImportTableButton<ExpenseItem>
                            onImport={onImport}
                            sampleFileURL={'/assets/import-expenses-example.xlsx'}
                            xlsxCols={xlsxCols}
                            title={'Импорт расходов'}
                            imgURL={'/assets/import-expenses-example.png'}
                            importedItemsFound={'записей о расходах'}
                        ></ImportTableButton>
                        <Button type={'primary'} onClick={handleAddRow}>Добавить строку</Button>
                    </>
                    : <Typography.Text type={'danger'}>Ваша роль {currentUser.role}, нельзя редактировать смету</Typography.Text>
                }
                <Typography.Text>Итого: </Typography.Text>
                <Typography.Text code strong>{item.expensePrice}</Typography.Text>
            </Space>
            <Space>
                <Button icon={<DownloadOutlined/>} onClick={onBtExport}>Скачать .xlsx</Button>
            </Space>
        </div>
    </div>);
}

