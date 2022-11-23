import { IUser } from '@/types/IUser'
import zod from 'zod'
import { buildError, invalidSchemaError } from '@lib/error'
import { crypt } from '@services/common/crypt'
import { User } from '@models/UserModel'

const createUser = zod.object({
  name: zod.string().min(1, 'name is required'),
  email: zod.string().min(1, { message: 'email is required' }).email('Invalid email provided'),
  password: zod.string().min(6, 'password must have at least 6 characters')
})

const create = async ({ name, email, password }: Pick<IUser, 'name' | 'email' | 'password'>): Promise<{ user: { email: string, name: string, _id: string } }> => {
  createUser.parse({ name, email, password })
  if (!email) {
    throw invalidSchemaError('Email')
  }

  if (await User.findOne({ email })) {
    throw buildError({ statusCode: 412, message: 'Email already taken' })
  }

  const hashPassword = crypt.createHash(password)

  const user = await User.create({
    name,
    email,
    password: hashPassword
  })
  return { user: { email: user.email, name: user.name, _id: user._id.toString() } }
}

export const userService = {
  create
}
