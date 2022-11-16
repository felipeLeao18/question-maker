import { config } from '@config'
import mongoose from 'mongoose'

export const connect = async (connectOptions?: mongoose.ConnectOptions) => {
  const mongoConfig: mongoose.ConnectOptions = {
    ignoreUndefined: true,
    autoIndex: false,
    autoCreate: false,
    maxPoolSize: 1,
    ...connectOptions
  }

  await mongoose.connect(config.DATABASE_URL, mongoConfig)
}
