import {useDispatch, useSelector} from "react-redux";
import {ISSUES} from "iso/src/store/bootstrap";
import {useMemo, useRef, useState} from "react";
import {AgGridReact} from "ag-grid-react";
import {
    ColDef,
    ICellRenderer,
    ISelectCellEditorParams,
    RowEditingStartedEvent,
    RowEditingStoppedEvent,
    StatusPanelDef
} from "ag-grid-community";
import {EstimationItem, ExpenseItem, IssueVO} from "iso/src/store/bootstrap/repos/issues";
import {Button, Space} from "antd";
import {equals, remove, update} from "ramda";

const countEstimations = (expenses: IssueVO['estimations']) =>
        expenses.reduce((prev, item)=> prev+(isNaN(Number(item.amount)) ? 0: Number(item.amount)), 0)


export default ({issueId}:{issueId: string}) => {
    const dispatch = useDispatch()
    const issue:IssueVO = useSelector(ISSUES.selectById(issueId))
    const initialItems = issue.estimations|| []
    const gridRef = useRef<AgGridReact>(null);
    const containerStyle = useMemo(() => ({ width: '100%', height: '100%' }), []);
    const gridStyle = useMemo(() => ({ height: '300px', width: '100%' }), []);
    const [rowData, setRowData] = useState<EstimationItem[]>(initialItems);
    const [columnDefs, setColumnDefs] = useState<ColDef[]>([
       /* {
            field: 'paymentType',
            headerName:'Оплата',
            cellEditor: 'agSelectCellEditor',
            cellEditorParams: {
                values: ['Наличные', 'Безналичные']
            } as ISelectCellEditorParams,

        },*/
        { field: 'title',headerName:'Наименование' },
        { field: 'amount',headerName:'Расходы',cellEditor: 'agNumberCellEditor',
            },
        { field: 'comment',headerName:'Комментарий'},
        {
            cellRenderer: (props:{rowIndex:number}) =>
                <Button danger={true} onClick={() => {
                   setRowData(remove(props.rowIndex,1,rowData))
                }}>Удалить</Button>
        }
    ]);
    const defaultColDef = useMemo<ColDef>(() => {
        return {
            flex: 1,
            minWidth: 110,
            editable: true,
            resizable: true,
        };
    }, []);
    const statusBar = useMemo<{
        statusPanels: StatusPanelDef[];
    }>(() => {
        return {
            statusPanels: [
                {
                    statusPanel: () => countEstimations(
                        rowData
                    )
                }, {
                statusPanel: () =>
                    <Button onClick={() => setRowData([...rowData,{}])}>Добавить</Button>
                }
            ],
        };
    }, []);
    const onCellEditingStarted = (e:RowEditingStartedEvent) => {
        console.log('RowEditingStartedEvent',e)
    }
    const onCellEditingStopped = (e: RowEditingStoppedEvent) => {
        if (e.rowIndex!== null)
        setRowData(update(e.rowIndex,e.data, rowData))
        console.log('RowEditingStoppedEvent',e)
    }

    return <div>

        <div className="ag-theme-alpine" style={gridStyle}>
            <AgGridReact
                ref={gridRef}
                rowData={rowData}
                columnDefs={columnDefs}
                defaultColDef={defaultColDef}
                onCellEditingStarted={onCellEditingStarted}
                onCellEditingStopped={onCellEditingStopped}
                statusBar={statusBar}
            />

    </div>

        <div style={{paddingTop: '8px'}}>
            <Space>
            <Button onClick={() => setRowData([...rowData,{}])}>Добавить</Button>
                { JSON.stringify(initialItems)===JSON.stringify(rowData) ? 'Нет изменений' :
                    <><Button type={'primary'} onClick={() =>
                        dispatch(ISSUES.actions.patched({issueId,estimations: rowData,estimationPrice: countEstimations(rowData)}))
                    } >Сохранить</Button>
                        <Button danger={true} onClick={() => setRowData(initialItems)} >Отменить</Button>
                    </>
                }
            </Space>
        </div>
    </div>
}

