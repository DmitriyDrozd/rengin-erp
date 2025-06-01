import {AgGridReact} from 'ag-grid-react'
import useCurrentUser from '../hooks/useCurrentUser'
import React from 'react'
import {ColDef} from 'ag-grid-community'
import {GridReadyEvent} from 'ag-grid-community/dist/lib/events'
import NoRowOverlay from './NoRowOverlay'


export type RGridProps<T> = {
    availableColumns: (ColDef)
    preferencesId?: string
}

export const useGrid = <T,>(props: RGridProps<T>) => {
    const {currentUser, } = useCurrentUser()
    const columnDefs = currentUser.grids
    const onGridReady = (event: GridReadyEvent<TData>) => {
        // event.
    }
    const Grid = () => {
        return <div className="ag-theme-alpine" style={{height: '100%', width: '100%'}}>
            <AgGridReact

                onGridReady={}
                noRowsOverlayComponent={NoRowOverlay}
                defaultColDef={defaultColDef}
                rowData={rowData}
                columnDefs={columnDefs}
            >

            </AgGridReact>
        </div>
    }

}