import express, { Request, Response, NextFunction } from 'express'
import 'express-async-errors'
import cors from 'cors'
import { router as userRouter } from './controllers/user/router'
import { router as authRouter } from './controllers/authentication/router'

const app = express()
app.use(express.json())
app.use(cors())

app.use(userRouter)
app.use(authRouter)

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  if (err.err && err.err instanceof Error) {
    return res.status(err.statusCode).json({
      message: err.message,
      status: 'error'
    })
  }
  if (err.errors) {
    const { errors } = err
    const errorMessages = errors.map((error: { code: string, expected: string, received: string, path: string[], message: string }) => {
      if (error.message !== 'Required') {
        return error.message
      }
      return `${error.path} is required`
    })
    return res.status(422).send({
      message: errorMessages,
      status: 'invalidSchemaError'
    })
  }
  return res.status(500).json({
    status: 'error',
    message: 'Internal server error'
  })
})
export { app }
