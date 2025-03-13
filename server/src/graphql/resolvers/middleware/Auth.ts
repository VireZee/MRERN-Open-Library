import Redis from '../../../database/Redis.ts'
import { User } from '../../../models/User.ts'
import type { Request } from 'express'
import { verToken } from '../../../utils/Validation.ts'
import { GraphQLError } from 'graphql'

interface Cache {
    photo: string;
    name: string;
    username: string;
    email: string;
}
const Auth = async (_: null, __: {}, context: { req: Request }) => {
    const t = context.req.cookies['!']
    if (!t) throw new GraphQLError('Unauthorized', { extensions: { code: '401' } })
    try {
        const decoded = verToken(t)
        const id = decoded['id']
        const res = (cache: Cache) => ({
            photo: Buffer.from(cache.photo).toString('base64'),
            name: cache.name,
            uname: cache.username,
            email: cache.email
        })
        const userCache = await Redis.call('JSON.GET', `user:${id}`) as Cache
        if (userCache) console.log(res(userCache))
        const user = await User.findById(id)
        if (!user) throw new GraphQLError('Unauthorized', { extensions: { code: '401' } })
        await Redis.call('JSON.SET', `user:${id}`, '$', JSON.stringify({
            photo: user.photo.toString(),
            name: user.name,
            username: user.username,
            email: user.email
        }))
        await Redis.expire(`user:${id}`, 86400)
        const newUserCache = await Redis.call('JSON.GET', `user:${id}`) as Cache
        return console.log(res(newUserCache))
    } catch (e) {
        throw e
    }
}
export default Auth