import mongoose, { Schema, Document } from 'mongoose'

interface IUser extends Document {
    photo: Buffer
    name: string
    username: string
    email: string
    pass: string
    api_key?: Buffer
    created: Date
    updated?: Date
}
const UserSchema = new Schema<IUser>({
    photo: { type: Buffer, required: true },
    name: { type: String, maxlength: 75, required: true, },
    username: { type: String, unique: true, maxlength: 20, required: true },
    email: { type: String, unique: true, required: true },
    pass: { type: String, required: true },
    api_key: { type: Buffer, required: false },
    updated: { type: Date },
    created: { type: Date, required: true }
})
const UserModel = mongoose.model<IUser>('User', UserSchema)
export default UserModel