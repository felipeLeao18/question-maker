import { buildError } from '@lib/error'
import { auth } from '@services/common/auth'
import { crypt } from '@services/common/crypt'
import zod from 'zod'
import { User } from '@models/UserModel'

const loginValid = zod.object({
  email: zod.string().min(1, { message: 'email is required' }).email('Invalid email provided'),
  password: zod.string().min(6, 'password must have at least 6 characters')
})

const login = async ({ email, password }): Promise<{ user: { _id: string, email: string }, token: string }> => {
  loginValid.parse({ email, password })
  const user = await User.findOne({ email })

  const validPassword = crypt.validateHash(password, user?.password ?? '')

  if (!user || !validPassword) {
    throw buildError({ statusCode: 401, message: 'Email or password is invalid' })
  }

  const token = auth.createToken({ userId: user._id.toString() })

  return {
    user: { _id: user._id.toString(), email: user.email },
    token
  }
}

export const authService = {
  login
}
