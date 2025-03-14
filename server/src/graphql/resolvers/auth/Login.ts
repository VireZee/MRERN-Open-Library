import { User } from '../../../models/User.ts'
import type { Response } from 'express'
import { verifyHash, generateToken } from '../../../utils/Validation.ts'
import { GraphQLError } from 'graphql'

const Login = async (_: null, args: { emailOrUsername: string, pass: string }, context: { res: Response }) => {
    try {
        const { emailOrUsername, pass } = args
        const user = await User.findOne({
            $or: [
                { email: emailOrUsername.toLowerCase() },
                { username: emailOrUsername.toLowerCase() }
            ]
        })
        if (!user || !(await verifyHash(pass, user!.pass))) throw new GraphQLError('Invalid login credentials!', { extensions: { code: '401' } })
        const t = generateToken(user._id)
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