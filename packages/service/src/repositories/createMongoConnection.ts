import mongoose from 'mongoose'

const createMongoConnection = async (config: { uri: string }) => {
    mongoose.set('strictQuery', true);
    return await mongoose.connect(config.uri, {
        //useNewUrlParser: true,
        autoIndex: false,
    })
}

export type MongoConnection = ReturnType<typeof createMongoConnection>

export default createMongoConnection
