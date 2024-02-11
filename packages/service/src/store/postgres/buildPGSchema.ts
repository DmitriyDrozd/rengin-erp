import {ColumnBuilder, Knex} from "knex";
import {ENTITIES_LIST, getEntityByEID} from "iso";
import {AnyAttr, AnyAttributes, AttrMeta, EntitySlice, ItemOfAttr} from "@shammasov/mydux";
import {ServerContext} from "../getServerContext";


export default async (ctx: ServerContext) => {
    let scheme = ctx.pg.schema
    const clearDB = () => {
        scheme.dropSchemaIfExists('public',true)
        scheme.createSchema('public')
    }

    const addColumnPropToTable = (table:Knex.TableBuilder, prop: AnyAttr ):ColumnBuilder | undefined=> {
        let col: ColumnBuilder
        if(prop.name === 'id')
            col = table.string(prop.name as string, 15).primary().unique()
        else if(prop.type === 'string')
            col = table.string(prop.name!, 255)
        else if(prop.type === 'enum')
            col = table.string(prop.name!,255)//prop.enum)
        else if(prop.type === 'number')
            col = table.double(prop.name!)
        else if(prop.type === 'boolean')
            col = table.boolean(prop.name!)
        else if(prop.type === 'itemOf')
            col = table.string(prop.name!, 15)
        else if(prop.type === 'date')
            col = table.datetime(prop.name!, {})
        else if(prop.type === 'text')
            col = table.text(prop.name!)

        return col
    }

    const addResource =  <EID extends string, Attrs extends AnyAttributes>( res:EntitySlice<Attrs,EID>)=> {
        const tableName = res.EID
        const propsList: AttrMeta<any>[] = Object.values(res.attributes)
        const columnsPropsList: AttrMeta<any>[] = propsList.filter(m => m.type!=='array')
        const subTablesPropsList: AttrMeta<'array'>[] = propsList.filter(m => m.type==='array')
        scheme.createTable(tableName, function (table) {
            columnsPropsList.forEach( prop =>{
                addColumnPropToTable(table, prop)
            })
        })
        subTablesPropsList.forEach( prop =>{
            scheme.createTable(tableName+'_'+prop.name, function (table: Knex.TableBuilder) {

                const subProps  =prop.attributes
                const propsList: AttrMeta<any>[] = Object.values(subProps)
                propsList.forEach( prop =>{
                    addColumnPropToTable(table, prop)
                })
            })
        })
        return scheme
    }
    const addForeignKeys = <EID extends string, Attrs extends AnyAttributes>( res:EntitySlice<Attrs,EID>)=> {
        const tableName = res.EID
        const propsList: AttrMeta<any>[] = Object.values(res.attributes)
        const columnsPropsList: AttrMeta<any>[] = propsList.filter(m => m.type !== 'array')

        console.log(scheme.alterTable(tableName, function (table) {

            columnsPropsList.filter(p => p.type === 'itemOf').forEach((p: ItemOfAttr) => {
                console.log('forieng key ' + tableName + '.' + p.name + ' -> ' + p.linkedEID.toLowerCase() + '.' + getEntityByEID(p.linkedEID).idKey)
                table.foreign(p.name).references('id').inTable(p.linkedEID.toLowerCase())
            
            })
            
        }).toString())
        return scheme
    }
    clearDB()

    for( const res of ENTITIES_LIST) {
       addResource(res)
    }
    for( const res of ENTITIES_LIST) {
        addForeignKeys(res)
    }

    const buildSchemeResult = await scheme

    return true
}
