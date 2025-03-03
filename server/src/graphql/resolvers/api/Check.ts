import AppDataSource from '../../../DataSource'
import User from '../../../models/User'
import { Request } from 'express'
import { verToken } from '../../../utils/Validation'
import { GraphQLError } from 'graphql'

const Check = async (_: null, __: {}, context: { req: Request }) => {
    const t = context.req.cookies['!']
    try {
        const userRepo = AppDataSource.getRepository(User)
        const { user_id } = verToken(t)
        const user = await userRepo.findOne({ where: { user_id } })
        return user!.api_key ? user!.api_key.toString('hex') : null
    } catch (e) {
        if (e instanceof GraphQLError) throw e
        else throw new GraphQLError('Internal Server Error', { extensions: { code: '500' } })
    }
}
export default Check