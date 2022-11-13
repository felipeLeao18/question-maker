import bcrypt from 'bcrypt'

const createHash = (data: string): string => {
  const hash = bcrypt.hashSync(data, 10)
  return hash
}

const validateHash = (data: string, dataHash: string): boolean => {
  const validHash: boolean = bcrypt.compareSync(data, dataHash)
  return validHash
}
export const crypt = {
  createHash,
  validateHash
}
