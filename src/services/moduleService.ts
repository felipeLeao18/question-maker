import zod from 'zod'
import { buildError, invalidOrderError, invalidSchemaError, unauthorizedError } from '@lib/error'
import { Module } from '@models/ModuleModel'
import { validateUserOnCourse } from '@services/courseService'

const createModule = zod.object({
  name: zod.string().min(1, 'name is required'),
  description: zod.string().optional(),
  order: zod.number().optional()
})

const create = async ({ name, description = 'description', order }, courseId: string, userId: string) => {
  await validateUserOnCourse(userId, courseId)

  createModule.parse({ name, description, order })

  const higherOrder = (await Module.findOne({ course: courseId }, { order: 1 }).sort({ order: 'desc' }))?.order

  if (order !== null && (order <= 0 || (order > (higherOrder ?? 0) + 1))) {
    throw invalidOrderError((higherOrder ?? 0) + 1)
  }

  const module = await Module.create({
    name,
    description,
    course: courseId,
    order: order || (higherOrder ?? 0) + 1
  })

  await Module.updateMany({
    order: { $gte: module.order },
    _id: { $ne: module._id },
    course: courseId
  }, { $inc: { order: 1 } })
  return module
}

const list = async ({ filter = '', page = 1, perPage = 20 }, courseId: string, userId: string) => {
  if (!courseId) {
    throw invalidSchemaError('courseId')
  }

  await validateUserOnCourse(userId, courseId)

  const fullFilter = filter
    ? { $or: [{ name: new RegExp(filter, 'gim') }, { description: new RegExp(filter, 'gim') }] }
    : {}

  const modules = await Module.find({
    ...fullFilter,
    course: courseId
  })
    .skip(perPage * (page - 1))
    .limit(perPage)
    .sort({ order: 'desc' })

  const totalSize = await Module.countDocuments({
    ...fullFilter,
    course: courseId
  })

  return {
    data: modules,
    totalSize,
    from: (page - 1) * perPage + 1,
    to: (page - 1) * perPage + modules.length
  }
}

const remove = async (moduleId: string, userId: string) => {
  if (!moduleId) {
    throw invalidSchemaError('moduleId')
  }

  const module = await Module.findById(moduleId).select('course')

  if (!module) {
    throw unauthorizedError()
  }

  await validateUserOnCourse(userId, module.course)

  const moduleRemoved = await Module.findByIdAndDelete(moduleId)
  await Module.updateMany({
    order: { $gt: moduleRemoved?.order },
    course: module.course
  }, { $inc: { order: -1 } })
  return moduleRemoved
}

const findById = async (courseId: string, userId: string) => {
  const module = await Module.findById(courseId)

  if (!module) {
    throw unauthorizedError()
  }

  await validateUserOnCourse(userId, module.course)

  return module
}

export const moduleService = {
  create,
  list,
  remove,
  findById
}
