import express, { Request, Response, NextFunction } from 'express'
import 'express-async-errors'

import cors from 'cors'
import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import { swaggerConf } from 'swaggerConf'

import { router as userRouter } from '@controllers/user/router'
import { router as authRouter } from '@controllers/authentication/router'
import { router as courseRouter } from '@controllers/course/router'
import { router as moduleRouter } from '@controllers/module/router'
import { router as lessonRouter } from '@controllers/lesson/router'

const specs = swaggerJsdoc(swaggerConf)

const app = express()
app.use(express.json())
app.use(cors())

app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(specs)
)
app.use(userRouter)
app.use(authRouter)
app.use(courseRouter)
app.use(moduleRouter)
app.use(lessonRouter)

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
