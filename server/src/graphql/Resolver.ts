import Schema from './Schema'
import Auth from './resolver/middleware/Auth'
import Register from './resolver/auth/Register'
import Login from './resolver/auth/Login'
import Fetch from './resolver/book/Fetch'
import Collection from './resolver/book/Collection'
import AddRemove from './resolver/book/AddRemove'
import Check from './resolver/api/Check'
import Generate from './resolver/api/Generate'
import Settings from './resolver/auth/Settings'
import Logout from './resolver/auth/Logout'
import Delete from './resolver/auth/Delete'

export const typeDefs = Schema
export const resolvers = {
    Query: {
        auth: Auth,
        fetch: Fetch,
        collection: Collection,
        check: Check
    },
    Mutation: {
        register: Register,
        login: Login,
        add: AddRemove,
        remove: AddRemove,
        generate: Generate,
        settings: Settings,
        logout: Logout,
        delete: Delete
    }
}