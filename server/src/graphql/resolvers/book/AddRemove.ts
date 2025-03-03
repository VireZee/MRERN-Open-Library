import { Raw } from 'typeorm'
import AppDataSource from '../../../DataSource'
import Col from '../../../models/Collection'
import { Request } from 'express'
import { verToken } from '../../../utils/Validation'
import { GraphQLError } from 'graphql'

const AddRemove = async (_: null, args: { author_key: string[], cover_edition_key: string, cover_i: number, isbn: string, title: string, author_name: string }, context: { req: Request }) => {
    const t = context.req.cookies['!']
    try {
        const colRepo = AppDataSource.getRepository(Col)
        const { user_id } = verToken(t)
        const { author_key, cover_edition_key, cover_i, title, author_name } = args
        const bookCollection = await colRepo.findOne({
            where: {
                user_id,
                author_key: Raw(ak => `${ak} = :author_key`, { author_key }),
                cover_edition_key,
                cover_i,
                title,
                author_name
            }
        })
        if (bookCollection) await colRepo.remove(bookCollection)
        else {
            const newBookCollection = colRepo.create({
                user_id,
                author_key,
                cover_edition_key,
                cover_i,
                title,
                author_name,
                created: new Date()
            })
            await colRepo.save(newBookCollection)
        }
        return true
    } catch (e) {
        if (e instanceof GraphQLError) throw e
        else throw new GraphQLError('Internal Server Error', { extensions: { code: '500' } })
    }
}
export default AddRemove