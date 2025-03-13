import type { Response } from 'express'

const Logout = (_: null, __: null, context: { res: Response }) => {
    try {
        context.res.clearCookie('!')
        return true
    } catch (e) {
        throw e
    }
}
export default Logout