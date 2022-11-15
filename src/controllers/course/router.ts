/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express'
import { verifyAuth } from '../../services/common/auth'
import { createCourse } from './createCourse'
import { listCourses } from './listCourses'
import { removeCourse } from './removeCourse'

const router = Router()

router.post('/courses', verifyAuth, createCourse)
router.get('/courses', verifyAuth, listCourses)
router.delete('/courses', verifyAuth, removeCourse)

export { router }
