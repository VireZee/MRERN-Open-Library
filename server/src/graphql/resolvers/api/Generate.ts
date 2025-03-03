import AppDataSource from '../../../DataSource'
import User from '../../../models/User'
import { Request } from 'express'
import { verToken } from '../../../utils/Validation'
import crypto from 'crypto'
import { GraphQLError } from 'graphql'

const Generate = async (_: null, __: {}, context: { req: Request }) => {
    const t = context.req.cookies['!']
    try {
        const userRepo = AppDataSource.getRepository(User)
        const { user_id } = verToken(t)
        const user = await userRepo.findOne({ where: { user_id } })
        const randomString = crypto.randomBytes(64).toString('hex')
        const apiKey = crypto.createHash('sha3-512').update(randomString).digest('hex')
        user!.api_key = Buffer.from(apiKey, 'hex')
        await userRepo.save(user!)
        return apiKey
    } catch (e) {
        if (e instanceof GraphQLError) throw e
        else throw new GraphQLError('Internal Server Error', { extensions: { code: '500' } })
    }
}
export default Generate