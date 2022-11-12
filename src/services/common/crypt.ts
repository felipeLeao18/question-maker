import bcrypt from 'bcrypt'

const createHash = (data: string) => {
  const hash = bcrypt.hashSync(data, 10)
  return hash
}

export const crypt = {
  createHash
}
