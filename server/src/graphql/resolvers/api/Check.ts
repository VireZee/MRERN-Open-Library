import { User } from '../../../models/User.ts'
import type { Request } from 'express'
import { verToken } from '../../../utils/Validation.ts'

const Check = async (_: null, __: null, context: { req: Request }) => {
    const t = context.req.cookies['!']
    try {
        const { id } = verToken(t)
        const user = await User.findById({ id })
        return user!.api_key ? user!.api_key.toString('hex') : null
    } catch (e) {
        throw e
    }
}
export default Check