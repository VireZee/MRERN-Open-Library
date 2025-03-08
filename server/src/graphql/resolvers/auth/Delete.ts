import User from '../../../models/User.ts'
import type { Request, Response } from 'express'
import { verToken } from '../../../utils/Validation.ts'
import { GraphQLError } from 'graphql'

const Delete = async (_: null, __: {}, context: { req: Request, res: Response }) => {
    const { req, res } = context
    const t = req.cookies['!']
    try {
        const { id } = verToken(t)
        const user = await User.findById({ id })
        if (!user) throw new GraphQLError('Unauthorized', { extensions: { code: '401' } })
        await User.findByIdAndDelete(id)
        res.clearCookie('!')
        return true
    } catch (e) {
        if (e instanceof GraphQLError) throw e
        else throw e
    }
}
export default Delete