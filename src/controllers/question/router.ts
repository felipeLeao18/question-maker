
/* eslint-disable @typescript-eslint/no-misused-promises */
import { verifyAuth } from '@services/common/auth'
import { Router } from 'express'

const router = Router()

router.post('/questions', verifyAuth, createQuestion)

export { router }
