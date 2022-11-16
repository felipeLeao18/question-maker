/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express'
import { verifyAuth } from '@services/common/auth'
import { createCourse } from '@controllers/course/createCourse'
import { getCourse } from '@controllers/course/getCourse'
import { listCourses } from '@controllers/course/listCourses'
import { removeCourse } from '@controllers/course/removeCourse'

const router = Router()

router.post('/courses', verifyAuth, createCourse)
router.get('/courses', verifyAuth, listCourses)
router.delete('/courses', verifyAuth, removeCourse)
router.get('/courses/:courseId', verifyAuth, getCourse)

export { router }
