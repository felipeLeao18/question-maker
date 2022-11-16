/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express'
import { login } from '@controllers/authentication/login'

const router = Router()

router.post('/auth', login)

export { router }
