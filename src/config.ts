import dotenv from 'dotenv'
dotenv.config()

export const config = {
  PORT: process.env.PORT ?? 3000,
  AUTH_TOKEN: process.env.AUTH_TOKEN ?? '5ce5ecba-608a-4561-932a-05e25b86f672'
}
