import zod from 'zod'
import { invalidOrderError, invalidSchemaError, unauthorizedError } from '@lib/error'
import { Module } from '@models/ModuleModel'
import { validateUserOnCourse } from '@services/courseService'
import { Lesson } from '@models/LessonModel'
import { ILesson } from '@/types/ILesson'

const createLesson = zod.object({
  name: zod.string().min(1, 'name is required'),
  description: zod.string().optional(),
  order: zod.number().optional()
})

const create = async ({ name, description = 'description', order }, moduleId: string, userId: string) => {
  createLesson.parse({ name, description, order })

  const higherOrder: Pick<ILesson, 'order'> & { module: {
    course: string
  } } = await Lesson.findOne({ module: moduleId }, { order: 1, module: 1 })
    .populate({ path: 'module', select: 'course' })
    .sort({ order: 'desc' })
    .lean()

  const courseId = higherOrder?.module.course ?? (await Module.findById(moduleId, { course: 1 }))?.course

  if (!courseId) {
    throw unauthorizedError()
  }
  await validateUserOnCourse(userId, courseId)

  if (order !== null && (order <= 0 || (order > (higherOrder?.order ?? 0) + 1))) {
    throw invalidOrderError((higherOrder?.order ?? 0) + 1)
  }

  const module = await Module.create({
    name,
    description,
    module: moduleId,
    order: order || (higherOrder?.order ?? 0) + 1
  })

  await Lesson.updateMany({
    order: { $gte: module.order },
    _id: { $ne: module._id },
    course: courseId
  }, { $inc: { order: 1 } })
  return module
}

const list = async ({ filter = '', page = 1, perPage = 20 }, moduleId: string, userId: string) => {
  if (!moduleId) {
    throw invalidSchemaError('moduleId')
  }

  const module = await Module.findById(moduleId).select('course')
  await validateUserOnCourse(userId, module?.course as string)

  const fullFilter = filter
    ? { $or: [{ name: new RegExp(filter, 'gim') }, { description: new RegExp(filter, 'gim') }] }
    : {}

  const lessons = await Lesson.find({
    ...fullFilter,
    module: moduleId
  })
    .skip(perPage * (page - 1))
    .limit(perPage)
    .sort({ order: 'desc' })

  const totalSize = await Lesson.countDocuments({
    ...fullFilter,
    module: moduleId
  })

  return {
    data: lessons,
    totalSize,
    from: (page - 1) * perPage + 1,
    to: (page - 1) * perPage + lessons.length
  }
}

const findById = async (lessonId: string, userId: string) => {
  const lesson: Omit<ILesson, 'module'> & { module: { course: string } } = await Lesson.findById(lessonId)
    .populate({ path: 'module', select: 'course' })
    .lean()

  if (!lesson) {
    throw unauthorizedError()
  }

  await validateUserOnCourse(userId, lesson.module.course)

  return lesson
}

const remove = async (lessonId: string, userId: string) => {
  if (!lessonId) {
    throw invalidSchemaError('lessonId')
  }

  const lesson: Omit<ILesson, 'module'> & { module: { course: string } } = await Lesson.findById(lessonId, { module: 1, order: 1 })
    .populate({ path: 'module', select: 'course' })
    .lean()

  if (!lesson) {
    throw unauthorizedError()
  }

  await validateUserOnCourse(userId, lesson.module.course)

  const lessonRemoved = await Lesson.findByIdAndDelete(lessonId)

  await Lesson.updateMany({
    module: lesson.module,
    order: { $gt: lesson.order }
  }, { $inc: { order: -1 } })
  return lessonRemoved
}

export const lessonService = {
  create,
  list,
  findById,
  remove
}
