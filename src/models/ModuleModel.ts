
import mongoose, { Schema } from 'mongoose'
import { CollectionEnum } from '@/types/CollectionsEnum'
import { IModule } from '@/types/IModule'

const moduleSchema = new Schema({
  name: { type: String },
  description: { type: String },
  order: { type: Number },
  course: {
    type: Schema.Types.ObjectId,
    ref: CollectionEnum.course
  }
}, { timestamps: true })

export const Module = mongoose.model<IModule>(CollectionEnum.module, moduleSchema, CollectionEnum.module)
