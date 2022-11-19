import mongoose, { Schema } from 'mongoose'
import { CollectionEnum } from '@/types/CollectionsEnum'
import { IQuestion } from '@/types/IQuestion'
import { QuestionTypesEnum } from '@/types/QuestionTypesEnum'

const questionSchema = new Schema({
  body: { type: String },
  value: { type: Number },
  type: {
    type: String,
    enum: QuestionTypesEnum
  },
  options: [{
    body: { type: String },
    correct: { type: Boolean },
    comment: { type: String }
  }],
  lesson: {
    type: Schema.Types.ObjectId,
    ref: CollectionEnum.lesson
  },
  module: {
    type: Schema.Types.ObjectId,
    ref: CollectionEnum.module
  }
}, { timestamps: true })

export const Question = mongoose.model<IQuestion>(CollectionEnum.question, questionSchema, CollectionEnum.question)
