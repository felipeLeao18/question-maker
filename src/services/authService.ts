import { buildError } from '../../lib/error'
import prismaClient from '../database/client'
import { auth } from './common/auth'
import { crypt } from './common/crypt'
import zod from 'zod'

const loginValid = zod.object({
  email: zod.string().min(1, { message: 'email is required' }).email('Invalid email provided'),
  password: zod.string().min(6, 'password must have at least 6 characters')
})

const login = async ({ email, password }): Promise<{ success: true, token: string }> => {
  loginValid.parse({ email, password })
  const user = await prismaClient.user.findUnique({ where: { email } })

  const validPassword = crypt.validateHash(password, user?.password ?? '')

  if (!user || !validPassword) {
    throw buildError({ statusCode: 401, message: 'Email or password is invalid' })
  }

  const token = auth.createToken({ userId: user.id })

  return {
    success: true,
    token
  }
}

export const authService = {
  login
}
