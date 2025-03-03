import { ILike } from 'typeorm'
import AppDataSource from '../../../DataSource'
import Col from '../../../models/Collection'
import { Request } from 'express'
import { verToken } from '../../../utils/Validation'
import { GraphQLError } from 'graphql'

const Collection = async (_: null, args: { search: string, page: number }, context: { req: Request }) => {
    const t = context.req.cookies['!']
    try {
        const colRepo = AppDataSource.getRepository(Col)
        const { user_id } = verToken(t)
        const { search = '', page } = args
        const limit = 9
        const [bookCollection, totalCollection] = await colRepo.findAndCount({
            where: {
                user_id,
                ...(search && { title: ILike(`%${search}%`) })
            },
            select: ['author_key', 'cover_edition_key', 'cover_i', 'title', 'author_name'],
            skip: (page - 1) * limit,
            take: limit,
            order: {
                created: {
                    direction: 'desc'
                }
            }
        })
        const found = bookCollection.length
        const collection = bookCollection.map(book => ({
            author_key: book.author_key,
            cover_edition_key: book.cover_edition_key,
            cover_i: book.cover_i,
            title: book.title,
            author_name: book.author_name
        }))
        return { found, collection, totalCollection }
    } catch (e) {
        if (e instanceof GraphQLError) throw e
        else throw new GraphQLError('Internal Server Error', { extensions: { code: '500' } })
    }
}
export default Collection