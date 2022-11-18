
/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express'
import { verifyAuth } from '@services/common/auth'
import { createLesson } from './createLesson'
const router = Router()

router.post('/lessons', verifyAuth, createLesson)

export { router }
