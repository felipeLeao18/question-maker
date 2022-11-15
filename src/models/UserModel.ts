
import mongoose, { Schema } from 'mongoose'
import { CollectionEnum } from '../types/CollectionsEnum'
import { IUser } from '../types/IUser'

const userSchema = new Schema({
  name: { type: String },
  email: { type: String },
  password: { type: String }
}, { timestamps: true })

export const User = mongoose.model<IUser>(CollectionEnum.user, userSchema, CollectionEnum.user)
