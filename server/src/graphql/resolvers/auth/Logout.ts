import Redis from '../../../database/Redis.ts'
import type { Request, Response } from 'express'
import { verToken } from '../../../utils/Validation.ts'

const Logout = async (_: null, __: null, context: { req: Request, res: Response }) => {
    const t = context.req.cookies['!']
    try {
        const { id } = verToken(t)
        await Redis.del(`user:${id}`)
        context.res.clearCookie('!')
        return true
    } catch (e) {
        throw e
    }
}
export default Logout