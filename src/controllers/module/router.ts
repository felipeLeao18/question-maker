
/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express'
import { verifyAuth } from '../../services/common/auth'
import { createModule } from './createModule'
import { getModule } from './getModule'
import { listModules } from './listModules'
import { removeModule } from './removeModule'

const router = Router()

router.post('/modules', verifyAuth, createModule)
router.delete('/modules', verifyAuth, removeModule)
router.get('/modules/:moduleId', verifyAuth, getModule)
router.get('/modules', verifyAuth, listModules)

export { router }
