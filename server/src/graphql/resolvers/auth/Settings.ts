import AppDataSource from '../../../DataSource'
import User from '../../../models/User'
import { Request, Response } from 'express'
import { valName, frmtName, valUname, frmtUname, valEmail, Hash, verHash, genToken, verToken } from '../../../utils/Validation'
import { GraphQLError } from 'graphql'

const Settings = async (_: null, args: { photo: string; name: string; uname: string; email: string; oldPass: string; newPass: string; rePass: string; show: boolean }, context: { req: Request, res: Response }) => {
    const { req, res } = context
    const t = req.cookies['!']
    try {
        const userRepo = AppDataSource.getRepository(User)
        const { user_id } = verToken(t)
        const { photo, name, uname, email, oldPass, newPass, rePass, show } = args
        const errs: Record<string, string> = {}
        const user = await userRepo.findOne({ where: { user_id } })
        const nameErr = valName(name)
        const unameErr = await valUname(uname, user!.user_id)
        const emailErr = await valEmail(email, user!.user_id)
        if (Buffer.byteLength(photo, 'base64') > 5592405) errs.photo = "Image size must not exceed 8MB (MiB)"
        if (nameErr) errs.name = nameErr
        if (unameErr) errs.uname = unameErr
        if (emailErr) errs.email = emailErr
        if (oldPass && !newPass) errs.newPass = "New password can't be empty!"
        if ((newPass && !oldPass) || (newPass && !(await verHash(oldPass, user!.pass)))) errs.oldPass = "Invalid current password"
        if (newPass && await verHash(newPass, user!.pass)) errs.newPass = "The new password can't be the same as the current password!"
        if (!show && newPass !== rePass) errs.rePass = "Password do not match!"
        if (Object.keys(errs).length > 0) throw new GraphQLError('Unprocessable Content', { extensions: { errs, code: '422' } })
        const updatedUser: Partial<User> = {}
        if (photo && Buffer.compare(Buffer.from(photo, 'base64'), user!.photo) !== 0) updatedUser.photo = Buffer.from(photo, 'base64')
        if (name && name !== user!.name) updatedUser.name = frmtName(name)
        if (uname && uname !== user!.username) updatedUser.username = frmtUname(uname)
        if (email && email !== user!.email) updatedUser.email = email
        if (newPass) updatedUser.pass = await Hash(newPass)
        if (Object.keys(updatedUser).length > 0) {
            updatedUser.updated = new Date()
            userRepo.merge(user!, updatedUser)
            await userRepo.save(user!)
            const t = genToken(user!.user_id)
            res.cookie('!', t, {
                maxAge: 1000 * 60 * 60 * 24 * 30,
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: "strict",
                priority: "high"
            })
        }
        return true
    } catch (e) {
        if (e instanceof GraphQLError) throw e
        else throw new GraphQLError('Internal Server Error', { extensions: { code: '500' } })
    }
}
export default Settings