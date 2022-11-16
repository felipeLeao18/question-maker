import { User } from '@models/UserModel'
import { crypt } from '@services/common/crypt'
import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import { auth } from '@services/common/auth'

const createUser = async () => {
  const user = await User.create({
    name: 'mock',
    password: crypt.createHash('123456'),
    email: 'mock@example.com'
  })

  return user
}

const getUser = async () => {
  const user = await User.findOne({})
  if (user) {
    return user._id.toString()
  }
}
const getToken = (userId: string) => {
  return auth.createToken({ userId })
}

const databases: any[] = []
const MEMORY_DATABASE_NAME = 'localhost-db'

const connect = async (id: string) => {
  const mongoConfig = {
    ignoreUndefined: true
  }

  const server = await MongoMemoryServer.create({
    instance: {
      dbName: MEMORY_DATABASE_NAME
    }
  })

  const databaseURL = server.getUri()

  const { connect: dbConnect } = mongoose
  const connection = await dbConnect(databaseURL, mongoConfig)
  databases.push({ id, server, connection })
}

const disconnect = async (id: string) => {
  const { server, connection } = databases.find((db) => db.id === id)
  await resetTestData()
  await connection.disconnect()
  await server.stop()
}

const resetTestData = async () => {
  const collections = mongoose.connection.collections

  for (const key in collections) {
    const collection = collections[key]
    await collection.deleteMany({})
  }
}

export {
  createUser,
  getUser,
  getToken,
  connect,
  disconnect,
  resetTestData
}
