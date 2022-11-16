
/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express'
import { verifyAuth } from '../../services/common/auth'
import { createModule } from './createModule'
import { getModule } from './getModule'

const router = Router()

router.post('/modules', verifyAuth, createModule)
router.get('/modules/:moduleId', verifyAuth, getModule)

export { router }
