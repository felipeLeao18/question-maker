import request from 'supertest'
import { createUser, getToken, getUser } from '../../../lib/test'
import { app } from '../../app'
import prismaClient from '../../database/client'

describe('integration: Create course', () => {
  beforeAll(async () => {
    await createUser()
  })
  afterEach(() => {
    jest.clearAllMocks()
    jest.restoreAllMocks()
  })

  afterAll(async () => {
    await prismaClient.user.deleteMany()
    await prismaClient.course.deleteMany()
    await prismaClient.$disconnect()
  })

  it('should return 422 when name is not provided', async () => {
    const userId = await getUser()
    const token = getToken(userId as string)
    const response = await request(app).post('/courses').send({
    }).set({ 'x-api-key': token })
    expect(response.statusCode).toBe(422)

    const error = response.body
    expect(error.status).toBe('invalidSchemaError')
    expect(error.message[0]).toBe('name is required')
  })
  it('should return 200 and create course', async () => {
    const userId = await getUser()

    const token = getToken(userId as string)

    const courseSut = {
      name: 'my_course',
      description: 'my_course_description'
    }
    const response = await request(app).post('/courses').send(courseSut).set({ 'x-api-key': token })

    expect(response.statusCode).toBe(200)

    const course = response.body
    expect(course.id).toBeDefined()
    expect(course.name).toBe(courseSut.name)
    expect(course.description).toBe(courseSut.description)

    const users = await prismaClient.course.findFirst({ where: { id: course.id } }).users()

    expect(users?.some(({ userId: userCourse }) => userCourse === userId))
  })
})
