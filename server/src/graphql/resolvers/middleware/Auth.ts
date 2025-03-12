import Redis from '../../../database/Redis.ts'
import { User } from '../../../models/User.ts'
import type { Request } from 'express'
import { verToken } from '../../../utils/Validation.ts'
import { GraphQLError } from 'graphql'

const Auth = async (_: null, __: {}, context: { req: Request }) => {
    const t = context.req.cookies['!']
    if (!t) throw new GraphQLError('Unauthorized', { extensions: { code: '401' } })
    try {
        const decoded = verToken(t)
        const id = decoded.id
        const userCache = await Redis.get(`user:${id}`)
        if (userCache) {
            const userData = JSON.parse(userCache)
            return {
                photo: Buffer.from(userData.photo).toString('base64'),
                name: userData.name,
                uname: userData.username,
                email: userData.email
            }
        }
        const user = await User.findOne({ _id: id })
        if (!user) throw new GraphQLError('Unauthorized', { extensions: { code: '401' } })
        await Redis.setex(`user:${id}`, 3600, JSON.stringify({
            photo: user.photo,
            name: user.name,
            uname: user.username,
            email: user.email
        }))
        return {
            photo: Buffer.from(user.photo).toString('base64'),
            name: user.name,
            uname: user.username,
            email: user.email
        }
    } catch (e) {
        throw e
    }
}
export default Auth