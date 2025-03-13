import Redis from '../../../database/Redis.ts'
import { User } from '../../../models/User.ts'
import type { Response } from 'express'
import { genSvg, valName, frmtName, valUname, frmtUname, valEmail, Hash, genToken } from '../../../utils/Validation.ts'
import { GraphQLError } from 'graphql'

const Register = async (_: null, args: { name: string; uname: string; email: string; pass: string; rePass: string; show: boolean }, context: { res: Response }) => {
    try {
        const { name, uname, email, pass, rePass, show } = args
        const errs: Record<string, string> = {}
        const nameErr = valName(name)
        const unameErr = await valUname(uname)
        const emailErr = await valEmail(email)
        if (nameErr) errs['name'] = nameErr
        if (unameErr) errs['uname'] = unameErr
        if (emailErr) errs['email'] = emailErr
        if (!pass) errs['pass'] = "Password can't be empty!"
        if (!show && pass !== rePass) errs['rePass'] = "Password do not match!"
        if (Object.keys(errs).length > 0) throw new GraphQLError('Unprocessable Content', { extensions: { errs, code: '422' } })
        const newUser = new User({
            photo: Buffer.from(genSvg(name), 'base64'),
            name: frmtName(name),
            username: frmtUname(uname),
            email,
            pass: await Hash(pass),
            created: new Date()
        })
        await newUser.save()
        await Redis.call('JSON.SET', `user:${newUser._id}`, '$', JSON.stringify({
            photo: newUser.photo.toString(),
            name: newUser.name,
            username: newUser.username,
            email: newUser.email
        }))
        await Redis.expire(`user:${newUser._id}`, 86400)
        const t = genToken(newUser._id)
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
export default Register