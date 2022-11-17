import mongoose, { Schema } from 'mongoose'
import { CollectionEnum } from '@/types/CollectionsEnum'
import { ILesson } from '@/types/ILesson'

const lessonSchema = new Schema({
  name: { type: String },
  description: { type: String },
  order: { type: Number },
  module: {
    type: Schema.Types.ObjectId,
    ref: CollectionEnum.module
  }
}, { timestamps: true })

export const Lesson = mongoose.model<ILesson>(CollectionEnum.lesson, lessonSchema, CollectionEnum.lesson)
