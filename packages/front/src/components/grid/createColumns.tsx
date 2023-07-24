import {ColumnType} from 'antd/es/table'
import * as React from 'react'
import {RenderedCell} from 'rc-table/lib/interface'
import {BuildNav, nav} from '../nav'
import {Link} from 'react-router-dom'
import {Button} from 'antd'
import {AntdIcons} from '../elements/AntdIcons'

export type FieldRender<RecordType, Prop extends keyof RecordType> = (value: RecordType[Prop], record: RecordType) => React.ReactNode

export type ColumnRender<RecordType, Prop extends keyof RecordType> = (value: Prop, record: RecordType, index: number) => React.ReactNode | RenderedCell<RecordType>

export const makeColumns = <D,>(columns: ColumnType<D>[] = []) => {
    const simpleColumn = <K extends keyof D>(prop: K):ColumnType<D> => {
        return {
            key: prop,
            dataIndex: prop,
            title: prop
        }
    }
    const cols = [...columns]
    const addCol = <P extends keyof D>(prop: P, title?: string, merge: ColumnType<D> |ColumnRender<D, P>  = {}) => {
        const baseCol = {
            key: prop,
            dataIndex: prop,
            title: title || prop,
        }

        return makeColumns([...columns, typeof merge === 'function' ?{
                ...baseCol,
                render: merge}
            : {
                ...baseCol, ...merge
            }])
    }
    return Object.assign(cols, {
        addCol,
        addEditCol:  (idProp: string, itemNavBase: string): ColumnType<any> =>
            addCol(idProp, ' ', {
                key:idProp+'_edit',
                title: ' ',
                dataIndex: idProp,
                render: id => <Link to={itemNavBase+'/'+id}><Button icon={<AntdIcons.EditFilled/>}/></Link>
            })
    })
}
