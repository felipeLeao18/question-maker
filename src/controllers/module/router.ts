
/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express'
import { verifyAuth } from '@services/common/auth'
import { createModule } from '@controllers/module/createModule'
import { getModule } from '@controllers/module/getModule'
import { listModules } from '@controllers/module/listModules'
import { removeModule } from '@controllers/module/removeModule'

const router = Router()

router.post('/modules', verifyAuth, createModule)
router.delete('/modules', verifyAuth, removeModule)
router.get('/modules/:moduleId', verifyAuth, getModule)
router.get('/modules', verifyAuth, listModules)

export { router }
