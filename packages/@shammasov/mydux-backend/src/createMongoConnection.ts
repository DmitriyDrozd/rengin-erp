import mongoose, {Mongoose} from "mongoose"
import {envConfig} from "@shammasov/utils";


export const createMongoConnection =  async (mongoURI = envConfig().getString('MONGO_URI')) => {
    console.log('MONGO_URI='+mongoURI)
    const result:  Promise<Mongoose> =   mongoose.connect(
        mongoURI ,{}
    ) as any

    const mon = await result
    return mon.connection
}

