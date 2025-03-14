import mongoose, { Schema, Types, Document } from 'mongoose';

interface ICollection extends Document {
    _id: Types.ObjectId
    user_id: Types.ObjectId
    author_key: string[]
    cover_edition_key: string
    cover_i: number
    title: string
    author_name: string
    created: Date
}
const CollectionSchema = new Schema<ICollection>({
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    author_key: { type: [String], required: true },
    cover_edition_key: { type: String, required: true },
    cover_i: { type: Number, required: true },
    title: { type: String, required: true },
    author_name: { type: String, required: true },
    created: { type: Date, required: true }
}, { versionKey: false })
export const Book = mongoose.model<ICollection>('Collection', CollectionSchema)