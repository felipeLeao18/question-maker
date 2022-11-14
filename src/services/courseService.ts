import zod from 'zod'
import prismaClient from '../database/client'

const createCourse = zod.object({
  name: zod.string().min(1, 'name is required'),
  description: zod.string().optional()
})

const create = async ({ name, description = 'description' }, userId: string) => {
  createCourse.parse({ name, description })

  const course = await prismaClient.course.create({
    data: {
      name,
      description,
      users: { create: [{ user: { connect: { id: userId } } }] }
    }
  })
  return course
}

const list = async ({ filter = '', page = 1, perPage = 20 }, userId: string) => {
  const fullFilter = filter
    ? { $OR: [{ name: { contains: filter } }, { description: { contains: filter } }] }
    : {}

  const courses = await prismaClient.course.findMany({
    skip: perPage * (page - 1),
    take: perPage,
    where: {
      ...fullFilter,
      users: { some: { userId } }
    },
    orderBy: {
      created_at: 'desc'
    }
  })

  return {
    data: courses,
    from: (page - 1) * perPage + 1,
    to: (page - 1) * perPage + courses.length
  }
}
export const courseService = {
  create,
  list
}
