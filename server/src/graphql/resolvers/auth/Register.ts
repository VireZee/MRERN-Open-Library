import AppDataSource from '../../../DataSource'
import User from '../../../models/User'
import { Response } from 'express'
import { genSvg, valName, frmtName, valUname, frmtUname, valEmail, Hash, genToken } from '../../../utils/Validation'
import { GraphQLError } from 'graphql'

const Register = async (_: null, args: { name: string; uname: string; email: string; pass: string; rePass: string; show: boolean }, context: { res: Response }) => {
    try {
        const userRepo = AppDataSource.getRepository(User)
        const { name, uname, email, pass, rePass, show } = args
        const errs: Record<string, string> = {}
        const nameErr = valName(name)
        const unameErr = await valUname(uname)
        const emailErr = await valEmail(email)
        if (nameErr) errs.name = nameErr
        if (unameErr) errs.uname = unameErr
        if (emailErr) errs.email = emailErr
        if (!pass) errs.pass = "Password can't be empty!"
        if (!show && pass !== rePass) errs.rePass = "Password do not match!"
        if (Object.keys(errs).length > 0) throw new GraphQLError('Unprocessable Content', { extensions: { errs, code: '422' } })
        const newUser = userRepo.create({
            photo: Buffer.from(genSvg(name), 'base64'),
            name: frmtName(name),
            username: frmtUname(uname),
            email,
            pass: await Hash(pass),
            created: new Date()
        })
        await userRepo.save(newUser)
        const t = genToken(newUser.user_id)
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
export default Register