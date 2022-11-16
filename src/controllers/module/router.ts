
/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express'
import { verifyAuth } from '../../services/common/auth'
import { createModule } from './createModule'
import { getModule } from './getModule'
import { removeModule } from './removeModule'

const router = Router()

router.post('/modules', verifyAuth, createModule)
router.delete('/modules', verifyAuth, removeModule)
router.get('/modules/:moduleId', verifyAuth, getModule)

export { router }
