import AppDataSource from '../../../DataSource'
import User from '../../../models/User'
import { Request } from 'express'
import { verToken } from '../../../utils/Validation'
import { GraphQLError } from 'graphql'

const Auth = async (_: null, __: {}, context: { req: Request }) => {
    const t = context.req.cookies['!']
    if (!t) throw new GraphQLError('Unauthorized', { extensions: { code: '401' } })
    try {
        const userRepo = AppDataSource.getRepository(User)
        const decoded = verToken(t)
        const user = await userRepo.findOne({ where: { user_id: decoded.user_id } })
        if (!user) throw new GraphQLError('Unauthorized', { extensions: { code: '401' } })
        return {
            photo: Buffer.from(user.photo).toString('base64'),
            name: user.name,
            uname: user.username,
            email: user.email
        }
    } catch (e) {
        if (e instanceof GraphQLError) throw e
        else throw new GraphQLError('Internal Server Error', { extensions: { code: '500' } })
    }
}
export default Auth