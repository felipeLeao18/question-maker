
/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express'
import { verifyAuth } from '@services/common/auth'
import { createLesson } from './createLesson'
import { listLessons } from './listLessons'
import { getLesson } from './getLesson'
import { removeLesson } from './removeLesson'
const router = Router()

router.post('/lessons', verifyAuth, createLesson)
router.get('/lessons', verifyAuth, listLessons)
router.get('/lessons/:lessonId', verifyAuth, getLesson)
router.delete('/lessons', verifyAuth, removeLesson)

export { router }
