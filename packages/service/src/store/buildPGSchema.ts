import Env from "../Env";
import knex, {ColumnBuilder, Knex} from "knex";
import {Res} from "iso";
import {Meta, MetaType} from "iso/src/store/bootstrap/core/valueTypes";
import {SagaOptions} from "../sagaOptions";
import {RESOURCES_LIST} from "iso/src/store/bootstrap/resourcesList";

export default async (options: SagaOptions) => {

    const scheme = options.pg.schema
    const addToScheme = (schema: Knex.SchemaBuilder, res:Res)=> {
        const tableName = res.factoryPrefix
const idKey = res.idKey

       return schema.dropTableIfExists(tableName).createTableIfNotExists(tableName, function (table) {
            Object.keys(res.properties).forEach( (key: keyof typeof res['properties']) =>{
                const prop:Meta<MetaType,any> = res.properties[key]
                let col: ColumnBuilder
                if(key === idKey)
                    col = table.string(key as string, 15).unique().primary()
                else if(prop.type === 'string')
                    col = table.string(prop.name, 255)
                else if(prop.type === 'enum') {
                    col = table.string(prop.name,255)
                }
                else if(prop.type === 'number') {
                    col = table.double(prop.name)
                }
                else if(prop.type === 'boolean') {
                    col = table.boolean(prop.name)
                }
                else if(prop.type === 'itemOf') {
                    col = table.string(prop.name, 15)
                }else if(prop.type === 'date') {
                    col = table.datetime(prop.name, {})
                }else if(prop.type === 'text') {
                    col = table.text(prop.name)
                }

            })
        })

    }

    for( const res of RESOURCES_LIST) {
        const tableName = res.factoryPrefix
        const hasTableResult = await scheme.hasTable(tableName)
        if(hasTableResult){
            await  scheme.dropTable(tableName)


        }
        const sh = addToScheme(scheme, res)
        await sh
    }
    const buildScheme = RESOURCES_LIST.reduce( (schema, res) => res ? addToScheme(schema, res): schema, options.pg.schema)
    const  result = await buildScheme

    return result
}
