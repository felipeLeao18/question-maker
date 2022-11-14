/* eslint-disable @typescript-eslint/naming-convention */
import { sign, verify } from 'jsonwebtoken'
import { config } from '../../config'

const createToken = ({ userId }: { userId: string }, options = { expiresIn: '1d' }) => {
  return sign({ user_id: userId }, config.AUTH_TOKEN, options)
}

const verifyJwt = (token: string) => {
  try {
    const payload = verify(token, config.AUTH_TOKEN)
    return payload
  } catch (e) {
    return null
  }
}
const parsePayload = (event) => {
  const token = event.headers['x-api-key']
  const user = verifyJwt(token)

  return user
}
const authUser = (event) => {
  const user = parsePayload(event)
  return user
}

export const verifyAuth = async (req, res, next) => {
  try {
    const user = authUser(req)
    if (typeof user === 'object' && user?.user_id) {
      req.user = user.user_id
    }
    next()
  } catch (error) {
    return res.status(403).json({ message: 'Forbidden' })
  }
}
const auth = {
  createToken
}

export {
  auth
}
