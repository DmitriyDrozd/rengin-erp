import 'ag-grid-enterprise'
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
//import './rengin-theme.css'
import {AgGridReact, AgGridReactProps} from 'ag-grid-react'
import React, {useMemo} from 'react'
import AG_GEID_LOCALE_RU from './locale.ru'


import {AnyAttributes, EntitySlice, ItemByAttrs} from '@shammasov/mydux'
import './styles.css'
import {TICKETS, USERS} from "iso";

export type ResVal = typeof USERS | typeof TICKETS

export type ItemTypeByRes  <Res extends ResVal> =
    Res extends {exampleItem: infer T}
    ? Res['exampleItem']
    : never

export type CellEditorProps<Res extends ResVal, VType = any> =  {
    data: ItemTypeByRes<Res>
    value: VType
}


export type RGridProps<EID extends string, Attrs extends AnyAttributes> = AgGridReactProps<ItemByAttrs<Attrs>> & {
    resource: EntitySlice<Attrs, EID>
    createItemProps?: Partial<ItemByAttrs<Attrs>>
    search?: string
    fullHeight?: boolean

}

const checkBoxColProps = {
    headerCheckboxSelection: true,
    checkboxSelection: true,
}
export default React.forwardRef( <EID extends string, Attrs extends AnyAttributes>({columnDefs , fullHeight,...props}: RGridProps<EID, Attrs>, ref:React.ForwardedRef<any>) => {

   /* const onFilterTextBoxChanged = useCallback(() => {
        gridRef.current!.api.setQuickFilter(
            (document.getElementById('filter-text-box') as HTMLInputElement).value
        );
    }, []);*/
        const localeText = useMemo<{
                [key: string]: string;
            }>(() => {
                return AG_GEID_LOCALE_RU;
            }, []);

         console.log(columnDefs)

        return <> <div className="ag-theme-alpine" style={{height: fullHeight ?  'calc(100vh - 144px)':'calc(100vh - 244px)', width: '100%'}}>
                    <AgGridReact<ItemByAttrs<Attrs>>
                        ref={ref}
                        localeText={localeText}
columnDefs={columnDefs}
                        defaultColDef={{resizable: true,sortable:true}}
                        enableRangeSelection={true}
                        allowContextMenuWithControlKey={true}
                        {...props}
                    >

                    </AgGridReact>
                </div>

            </>


}, )