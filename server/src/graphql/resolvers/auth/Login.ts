import { User } from '../../../models/User.ts'
import type { Response } from 'express'
import { verHash, genToken } from '../../../utils/Validation.ts'
import { GraphQLError } from 'graphql'

const Login = async (_: null, args: { emailOrUname: string, pass: string }, context: { res: Response }) => {
    try {
        const { emailOrUname, pass } = args
        const user = await User.findOne({
            $or: [
                { email: emailOrUname.toLowerCase() },
                { username: emailOrUname.toLowerCase() }
            ]
        }).select('+pass')
        if (!user || !(await verHash(pass, user!.pass))) throw new GraphQLError('Invalid login credentials!', { extensions: { code: '401' } })
        const t = genToken(user._id)
        context.res.cookie('!', t, {
            maxAge: 1000 * 60 * 60 * 24 * 30,
            httpOnly: true,
            secure: process.env['NODE_ENV'] === 'production',
            sameSite: "strict",
            priority: "high"
        })
        return true
    } catch (e) {
        throw e
    }
}
export default Login