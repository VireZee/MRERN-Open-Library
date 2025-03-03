import mongoose from 'mongoose'
import '../configs/env.ts'

const MongoDB = async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017/mrern_open_library")
        const collections = await mongoose.connection.db!.listCollections().toArray()
        const collectionNames = collections.map(col => col.name)
        const targetCollections = ['users', 'books']
        for (const name of targetCollections) {
            if (!collectionNames.includes(name)) {
                await mongoose.connection.db!.createCollection(name, {
                    timeseries: { 
                        timeField: 'timestamp',
                        metaField: 'user_info',
                        granularity: 'minutes'
                    }
                })
            }
        }
    } catch {
    }
};
export default MongoDB