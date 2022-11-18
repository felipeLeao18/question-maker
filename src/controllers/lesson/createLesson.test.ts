import { app } from '@app'
import { connect, createUser, disconnect, resetTestData, getUser, getToken } from '@lib/test'
import { Course } from '@models/CourseModel'
import { Module } from '@models/ModuleModel'
import request from 'supertest'

describe('integration: Create lesson', () => {
  beforeAll(async () => {
    await connect(__filename)
    await createUser()
  })

  afterEach(async () => {
    await resetTestData()
    jest.clearAllMocks()
    jest.restoreAllMocks()
  })

  afterAll(async () => {
    await disconnect(__filename)
  })

  const createModuleSut = async (userId: string) => {
    const course = await Course.create({
      name: 'mock_course',
      users: [userId]
    })

    const module = await Module.create({
      course: course._id,
      name: 'module_mock'
    })

    return module
  }
  it('should return 422 when name is not provided', async () => {
    const userId = await getUser()
    const token = getToken(userId as string)

    const response = await request(app).post('/lessons').send({
    }).set({ 'x-api-key': token })
    expect(response.statusCode).toBe(422)

    const error = response.body
    expect(error.status).toBe('invalidSchemaError')
    expect(error.message[0]).toBe('name is required')
  })
  it('should return 200 and create lesson', async () => {
    const userId = await getUser()
    const token = getToken(userId as string)
    const module = await createModuleSut(userId as string)

    const lessonSut = {
      moduleId: module._id,
      name: 'mock_lesson'
    }
    const response = await request(app).post('/lessons').send({
    }).set({ 'x-api-key': token })
    expect(response.statusCode).toBe(422)

    const lesson = response.body
    expect(lesson.name).toBe(lessonSut.name)
    expect(lesson.order).toBe(1)
  })
})
