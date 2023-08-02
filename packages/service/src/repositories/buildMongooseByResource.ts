import {AnyMeta, Resource} from 'iso/src/store/bootstrap/core/createResource'
import {createSchema, Type} from 'ts-mongoose'
import {MetaType} from 'iso/src/store/bootstrap/core/valueTypes'

const mapMetaProp = <M extends AnyMeta>(prop: M) => {
    const type: MetaType = prop.type
    if(prop.type === 'string') {
        return Type.string({required: prop.required})
    }
    if(prop.type === 'boolean') {
        return Type.boolean({required: prop.required})
    }
    if(prop.type === 'number') {
        return Type.number({required: prop.required})
    }
    if(prop.type === 'array') {
        return Type.array({required: prop.required}).of(Type.mixed({}))
    }
    if(prop.type === 'date' || prop.type === 'datetime') {
        return Type.date({required: prop.required})
    }
    return Type.mixed({required: prop.required})


}
export default  <RID extends string, Properties extends {[key in string]: AnyMeta}>(resource: Resource<RID,Properties>) => {
    const obj = {}
    Object.keys(resource.properties).map( k =>
    obj[k] = mapMetaProp(resource.properties[k]))
    const schema = createSchema(obj,  {strict: false, timestamps: true, versionKey: false})
    return schema
}