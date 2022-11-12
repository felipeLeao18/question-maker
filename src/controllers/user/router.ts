/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express'
import { createUser } from './createUser'

const router = Router()

router.post('/users', createUser)

export { router }
