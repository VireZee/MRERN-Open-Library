import mongoose from 'mongoose'
import '../configs/env.ts'

const MongoDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/mrern_open_library')
        const collections = await mongoose.connection.db!.listCollections().toArray()
        const collectionNames = collections.map(col => col.name)
        const targetCollections = ['users', 'books']
        for (const name of targetCollections) {
            if (!collectionNames.includes(name)) {
                await mongoose.connection.db!.createCollection(name, {
                    timeseries: {
                        timeField: 'timestamp',
                        metaField: name === 'users' ? 'user_info' : 'book_info',
                        granularity: 'minutes'
                    },
                    collation: {
                        locale: 'en',
                        strength: 5,
                        caseLevel: true,
                        caseFirst: 'upper',
                        numericOrdering: true,
                        alternate: 'non-ignorable',
                        maxVariable: 'punct',
                        backwards: false,
                        normalization: true
                    }
                })
            }
        }
    } catch (e) {
        throw e
    }
}
export default MongoDB