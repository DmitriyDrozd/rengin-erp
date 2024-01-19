import {ColumnBuilder, Knex} from "knex";
import {ItemOfMeta, Meta} from "iso/src/store/bootstrap/core/valueTypes";
import {SagaOptions} from "../sagaOptions";
import {getRes, Resource, RESOURCES_LIST} from "iso/src/store/bootstrap/resourcesList";
import {AnyFieldsMeta} from "iso/src/store/bootstrap/core/createResource";


export default async (options: SagaOptions) => {
    let scheme = options.pg.schema
    const clearDB = () => {
        scheme.dropSchemaIfExists('public',true)
        scheme.createSchema('public')
    }

    const addColumnPropToTable = (table:Knex.TableBuilder, prop: Meta<any,any> ):ColumnBuilder | undefined=> {
        let col: ColumnBuilder
        if(prop.isIDProp)
            col = table.string(prop.name as string, 15).unique()
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

    const addResource =  <RID extends string, Fields extends AnyFieldsMeta>( res:Resource<RID,Fields>)=> {
        const tableName = res.factoryPrefix
        const propsList: Meta<any>[] = Object.values(res.properties)
        const columnsPropsList: Meta<any>[] = propsList.filter(m => m.type!=='array')
        const subTablesPropsList: Meta<'array'>[] = propsList.filter(m => m.type==='array')
        scheme.createTable(tableName, function (table) {
            columnsPropsList.forEach( prop =>{
                addColumnPropToTable(table, prop)
            })
        })
        subTablesPropsList.forEach( prop =>{
            scheme.createTable(tableName+'_'+prop.name, function (table: Knex.TableBuilder) {
                table.increments('id',{primaryKey: true})
                addColumnPropToTable(table, {...res.idMeta, isIDProp: false})
                table.foreign('issueId').references('issueId').inTable('issues')
                const subProps  =prop.properties
                const propsList: Meta<any>[] = Object.values(subProps)
                propsList.forEach( prop =>{
                    addColumnPropToTable(table, prop)
                })
            })
        })
        return scheme
    }
    const addForeignKeys = <RID extends string, Fields extends AnyFieldsMeta>( res:Resource<RID,Fields>)=> {
        const tableName = res.factoryPrefix
        const propsList: Meta<any>[] = Object.values(res.properties)
        const columnsPropsList: Meta<any>[] = propsList.filter(m => m.type !== 'array')

        console.log(scheme.alterTable(tableName, function (table) {

            columnsPropsList.filter(p => p.type === 'itemOf').forEach((p: ItemOfMeta) => {
                console.log('forieng key ' + tableName + '.' + p.name + ' -> ' + p.linkedResourceName.toLowerCase() + '.' + getRes(p.linkedResourceName).idKey)
                table.foreign(p.name).references(getRes(p.linkedResourceName).idKey).inTable(p.linkedResourceName.toLowerCase())
            
            })
            
        }).toString())
        return scheme
    }
    clearDB()

    for( const res of RESOURCES_LIST) {
       addResource(res)
    }
    for( const res of RESOURCES_LIST) {
        addForeignKeys(res)
    }

    const buildSchemeResult = await scheme

    return true
}
