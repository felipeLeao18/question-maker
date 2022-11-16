
/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express'
import { verifyAuth } from '../../services/common/auth'
import { createModule } from './createModule'

const router = Router()

router.post('/modules', verifyAuth, createModule)

export { router }
