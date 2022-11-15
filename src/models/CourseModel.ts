
import mongoose, { Schema } from 'mongoose'
import { CollectionEnum } from '../types/CollectionsEnum'
import { ICourse } from '../types/ICourse'

const courseSchema = new Schema({
  name: { type: String },
  description: { type: String },
  users: [{
    type: Schema.Types.ObjectId,
    ref: CollectionEnum.user
  }]
}, { timestamps: true })

export const Course = mongoose.model<ICourse>(CollectionEnum.course, courseSchema, CollectionEnum.course)
