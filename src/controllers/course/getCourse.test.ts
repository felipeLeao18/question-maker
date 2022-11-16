
import {
  connect,
  createUser,
  disconnect,
  getToken,
  getUser,
  resetTestData
} from '@lib/test'
import request from 'supertest'
import { app } from '@app'
import { ObjectId } from 'mongodb'
import { Course } from '@models/CourseModel'

describe('integration: get course', () => {
  beforeAll(async () => {
    await connect(__filename)
    await createUser()
  })
  afterEach(async () => {
    await resetTestData()
    await createUser()
  })
  afterAll(async () => {
    await disconnect(__filename)
  })
  it('should fail when course is not linked to user', async () => {
    const userId = await getUser()
    const token = getToken(userId as string)

    const course = await Course.create({
      name: 'mock_course',
      description: 'mock_description',
      users: [new ObjectId(), new ObjectId()]
    })

    const response = await request(app)
      .get(`/courses/${course._id}`)
      .set({ 'x-api-key': token })

    expect(response.statusCode).toBe(401)
    const err = response.body

    expect(err.message).toBe('Unauthorized')
  })
  it('should get course', async () => {
    const userId = await getUser()
    const token = getToken(userId as string)

    const courseSut = await Course.create({
      name: 'mock_course',
      description: 'mock_description',
      users: [new ObjectId(), userId]
    })

    const response = await request(app)
      .get(`/courses/${courseSut._id}`)
      .set({ 'x-api-key': token })

    expect(response.statusCode).toBe(200)
    const course = response.body

    expect(course).toBeDefined()
    expect(course.name).toBe(courseSut.name)
    expect(course.description).toBe(courseSut.description)
  })
})
