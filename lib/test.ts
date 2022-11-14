import prismaClient from '../src/database/client'
import { auth } from '../src/services/common/auth'
import { crypt } from '../src/services/common/crypt'

const createUser = async () => {
  const user = await prismaClient.user.create({
    data: {
      name: 'mock',
      password: crypt.createHash('123456'),
      email: 'mock@example.com'
    }
  })

  return user
}

const getUser = async () => {
  const user = await prismaClient.user.findFirst()
  if (user) {
    return user.id
  }
}
const getToken = (userId: string) => {
  return auth.createToken({ userId })
}

export {
  createUser,
  getUser,
  getToken
}
