import zod from 'zod'
import { buildError } from '@lib/error'
import { Course } from '@models/CourseModel'

const createCourse = zod.object({
  name: zod.string().min(1, 'name is required'),
  description: zod.string().optional()
})

const create = async ({ name, description = 'description' }, userId: string) => {
  createCourse.parse({ name, description })

  const course = await Course.create({
    name,
    description,
    users: [userId]
  })
  return course
}

const list = async ({ filter = '', page = 1, perPage = 20 }, userId: string) => {
  const fullFilter = filter
    ? { $or: [{ name: new RegExp(filter, 'gim') }, { description: new RegExp(filter, 'gim') }] }
    : {}

  const courses = await Course.find({
    users: userId,
    fullFilter
  })
    .skip(perPage * (page - 1))
    .limit(perPage)
    .sort({ createdAt: 'desc' })

  const totalSize = await Course.countDocuments({
    users: userId,
    fullFilter
  })
  return {
    data: courses,
    totalSize,
    from: (page - 1) * perPage + 1,
    to: (page - 1) * perPage + courses.length
  }
}

const remove = async (courseId: string, userId: string) => {
  if (!courseId) {
    throw buildError({ statusCode: 422, message: 'courseId not provided' })
  }

  const courseRemoved = await Course.findOneAndRemove({
    _id: courseId,
    users: userId
  })

  if (!courseRemoved) {
    throw buildError({ statusCode: 401, message: 'Unauthorized' })
  }

  return courseRemoved
}

const findById = async (courseId: string, userId: string) => {
  const course = await Course.findOne({
    users: userId,
    _id: courseId
  })

  if (!course) {
    throw buildError({ statusCode: 401, message: 'Unauthorized' })
  }

  return course
}

export const validateUserOnCourse = async (userId: string, courseId: string) => {
  if (!userId || !courseId) {
    throw buildError({ statusCode: 401, message: 'Unauthorized' })
  }

  const userOnCourse = await Course.exists({ _id: courseId, users: userId })
  if (!userOnCourse) {
    throw buildError({ statusCode: 401, message: 'Unauthorized' })
  }
}

export const courseService = {
  create,
  list,
  remove,
  findById
}
