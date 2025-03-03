import AppDataSource from '../../../DataSource'
import User from '../../../models/User'
import { Request, Response } from 'express'
import { verToken } from '../../../utils/Validation'
import { GraphQLError } from 'graphql'

const Delete = async (_: null, __: {}, context: { req: Request, res: Response }) => {
    const { req, res } = context
    const t = req.cookies['!']
    try {
        const userRepo = AppDataSource.getRepository(User)
        const { user_id } = verToken(t)
        const user = await userRepo.findOne({ where: { user_id } })
        if (!user) throw new GraphQLError('Unauthorized', { extensions: { code: '401' } })
        await userRepo.remove(user)
        res.clearCookie('!')
        return true
    } catch (e) {
        if (e instanceof GraphQLError) throw e
        else throw new GraphQLError('Internal Server Error', { extensions: { code: '500' } })
    }
}
export default Delete