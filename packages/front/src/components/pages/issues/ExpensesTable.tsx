import {useDispatch, useSelector} from "react-redux";
import {ISSUES} from "iso/src/store/bootstrap";
import {useMemo, useRef, useState} from "react";
import {AgGridReact} from "ag-grid-react";
import {
    ColDef,
    ISelectCellEditorParams,
    RowEditingStartedEvent,
    RowEditingStoppedEvent,
    StatusPanelDef
} from "ag-grid-community";
import {ExpenseItem, IssueVO} from "iso/src/store/bootstrap/repos/issues";
import {Button, Space} from "antd";
import {clone, remove} from "ramda";

const countExpenses = (expenses: IssueVO['expenses']) =>
        expenses.reduce((prev, item)=> prev+(isNaN(Number(item.amount)) ? 0: Number(item.amount)), 0)


export default ({issueId,  onItemChange}:{issueId: string}) => {
    const dispatch = useDispatch()
    const issue:IssueVO = useSelector(ISSUES.selectById(issueId))
    const [initialItems]= useState(clone(issue.expenses|| []))
    const [isEdited, setIsEdited] = useState(false)
    const gridRef = useRef<AgGridReact>(null);
    const containerStyle = useMemo(() => ({ width: '100%', height: '100%' }), []);
    const gridStyle = useMemo(() => ({ height: '300px', width: '100%' }), []);
    const [rowData, setRowData] = useState<ExpenseItem[]>(initialItems);
    const [columnDefs, setColumnDefs] = useState<ColDef[]>([
        {
            field: 'paymentType',
            headerName:'Оплата',
            cellEditor: 'agSelectCellEditor',
            cellEditorParams: {
                values: ['Наличные', 'Безналичные']
            } as ISelectCellEditorParams,
        },
        {
            field: 'purposeType',
            headerName:'Назначение',
            cellEditor: 'agSelectCellEditor',
            width: 120,
            cellEditorParams: {
                values: ['Материалы', 'Работы','ГСМ','Прочее']
            } as ISelectCellEditorParams,
        },
        { field: 'title',headerName:'Наименование',  width: 140, },
        { field: 'amount',headerName:'Расходы',cellEditor: 'agNumberCellEditor', },
        { field: 'date',headerName:'Дата оплаты',
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
                    statusPanel: () => countExpenses(
                        rowData
                    )
                }, {
                statusPanel: () =>
                    <Button onClick={() => setRowData([...rowData,{date: new Date().toISOString()}])}>Добавить</Button>
                }
            ],
        };
    }, []);
    const onCellEditingStarted = (e:RowEditingStartedEvent) => {
        console.log('RowEditingStartedEvent',e)
    }
    const onCellEditingStopped = (e: RowEditingStoppedEvent) => {
        let items: Array<ExpenseItem> = [];
        gridRef.current.api.forEachNode(function(node) {

                items.push(node.data);
        });
        setRowData(items)
        setIsEdited(true)

        console.log('RowEditingStoppedEvent',e,items)
    }

    const onSave = () => {
        let items: Array<ExpenseItem> = [];
        gridRef.current.api.forEachNode(function(node) {
            if(node.data.amount)
            items.push(node.data);
        });
        setIsEdited(false)
        const upd = {issueId,expenses: items,expensePrice: countExpenses(items)}

        dispatch(ISSUES.actions.patched({...upd}))
    }

    console.warn('init and current',JSON.stringify(initialItems),JSON.stringify(rowData) )
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
            <Button onClick={() => setRowData([...rowData,{paymentType:'Безналичные',purpuseType:'Материалы'}])}>Добавить</Button>
                {(!isEdited) ? 'Нет изменений' :
                    <><Button type={'primary'} onClick={onSave
                    } >Сохранить</Button>
                        <Button danger={true} onClick={() => setRowData(initialItems)} >Отменить</Button>
                    </>
                }
            </Space>
        </div>
    </div>
}

