import {AnyFieldsMeta, Resource} from "iso/src/store/bootstrap/core/createResource";
import getMongoDAO from "./getMongoDAO";
import {getPGDAO} from "./getPGDAO";
import {SagaOptions} from "../sagaOptions";
import {UnPromisify} from "@sha/utils";
import {Meta} from "iso/src/store/bootstrap/core/valueTypes";


export const getRepo = async <RID extends string, Fields extends {[key in string]: Meta<any>} >(res: Resource<RID,Fields> , io:SagaOptions) => {
    const makeMongoDao = async <RID extends string, P extends AnyFieldsMeta>(res: Resource<RID,P>) => {
        return await getMongoDAO({mongo: io.mongo}, res)
    }
    const makePgDao = async  <RID extends string, P extends AnyFieldsMeta>(res: Resource<RID,P>) => {
        return await getPGDAO(io, res)
    }
    return {
        ...res,
        mongoDao: await makeMongoDao(res),
        pgDao: await makePgDao(res),
    }
}


export type Repo = UnPromisify<ReturnType<typeof getRepo>>
