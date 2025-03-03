import AppDataSource from '../../../DataSource'
import User from '../../../models/User'
import { Response } from 'express'
import { verHash, genToken } from '../../../utils/Validation'
import { GraphQLError } from 'graphql'

const Login = async (_: null, args: { emailOrUname: string, pass: string }, context: { res: Response }) => {
    try {
        const userRepo = AppDataSource.getRepository(User)
        const { emailOrUname, pass} = args
        const user = await userRepo.findOne({
            where: [
                { email: emailOrUname.toLowerCase() },
                { username: emailOrUname.toLowerCase() }
            ]
        })
        if (!user || !(await verHash(pass, user!.pass))) throw new GraphQLError('Invalid login credentials!', { extensions: { code: '401' } })
        const t = genToken(user.user_id)
        context.res.cookie('!', t, {
            maxAge: 1000 * 60 * 60 * 24 * 30,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: "strict",
            priority: "high"
        })
        return true
    } catch (e) {
        if (e instanceof GraphQLError) throw e
        else throw new GraphQLError('Internal Server Error', { extensions: { code: '500' } })
    }
}
export default Login