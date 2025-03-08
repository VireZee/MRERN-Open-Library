import type { Response } from 'express'
import { GraphQLError } from 'graphql'

const Logout = (_: null, __: {}, context: { res: Response }) => {
    try {
        context.res.clearCookie('!')
        return true
    } catch (e) {
        if (e instanceof GraphQLError) throw e
        else throw e
    }
}
export default Logout