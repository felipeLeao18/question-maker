import request from 'supertest'
import { connect, createUser, disconnect, getToken, getUser, resetTestData } from '@lib/test'
import { app } from '@app'
import { Course } from '@models/CourseModel'

describe('integration: Create course', () => {
  beforeAll(async () => {
    await connect(__filename)
  })

  afterEach(async () => {
    await resetTestData()
    jest.clearAllMocks()
    jest.restoreAllMocks()
  })

  afterAll(async () => {
    await disconnect(__filename)
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
    await createUser()
    const userId = await getUser()

    const token = getToken(userId as string)

    const courseSut = {
      name: 'my_course',
      description: 'my_course_description'
    }
    const response = await request(app).post('/courses').send(courseSut).set({ 'x-api-key': token })

    expect(response.statusCode).toBe(200)

    const course = response.body
    expect(course._id).toBeDefined()
    expect(course.name).toBe(courseSut.name)
    expect(course.description).toBe(courseSut.description)

    const courseDb = await Course.findById(course._id)

    expect(courseDb?.users?.some(courseUserId => courseUserId.toString() === userId?.toString())).toBeTruthy()
  })
})
