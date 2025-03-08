import { Types } from 'mongoose'
import Book from '../../../models/Collection.ts'
import { GraphQLError } from 'graphql'

const Books = async (parent: { id: Types.ObjectId }) => {
    try {
        const { id } = parent
        const books = await Book.findById(id)
        return books.map(book => ({
            author_key: book.author_key,
            cover_edition_key: book.cover_edition_key,
            cover_i: book.cover_i,
            title: book.title,
            author_name: book.author_name
        }))
    } catch {
        throw new GraphQLError('Internal Server Error', { extensions: { code: '500' } })
    }
}
export default Books