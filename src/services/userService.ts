import { IUser } from '../types/IUser'
import zod from 'zod'
import { buildError } from '../../lib/error'
import prismaClient from '../database/client'
import { crypt } from './common/crypt'

const createUser = zod.object({
  name: zod.string().min(1, 'name is required'),
  email: zod.string().min(1, { message: 'email is required' }).email('Invalid email provided'),
  password: zod.string().min(6, 'password must have at least 6 characters')
})

const create = async ({ name, email, password }: Pick<IUser, 'name' | 'email' | 'password'>): Promise<{ success: true }> => {
  createUser.parse({ name, email, password })
  if (!email) {
    throw buildError({ statusCode: 422, message: 'Email not provided' })
  }

  if (await prismaClient.user.findFirst({ where: { email } })) {
    throw buildError({ statusCode: 412, message: 'Email already taken' })
  }

  const hashPassword = crypt.createHash(password)

  await prismaClient.user.create({
    data: {
      name,
      email,
      password: hashPassword
    }
  })
  return { success: true }
}

export const userService = {
  create
}
