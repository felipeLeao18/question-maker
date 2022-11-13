import { sign } from 'jsonwebtoken'
import { config } from '../../config'

const createToken = ({ userId }: { userId: string }, options = { expiresIn: '1d' }) => {
  return sign({ user_id: userId }, config.AUTH_TOKEN, options)
}

const auth = {
  createToken
}

export {
  auth
}
