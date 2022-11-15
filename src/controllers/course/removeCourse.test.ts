import { connect, createUser, disconnect, getToken, getUser, resetTestData } from '../../../lib/test'
import request from 'supertest'
import { app } from '../../app'
import { ObjectId } from 'mongodb'
import { Course } from '../../models/CourseModel'

describe('integration: remove course', () => {
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
  it('should fail when courseId is not provided', async () => {
    const userId = await getUser()
    const token = getToken(userId as string)

    const response = await request(app)
      .delete('/courses')
      .send({ courseId: '' })
      .set({ 'x-api-key': token })

    expect(response.statusCode).toBe(422)

    const error = response.body
    expect(error.message).toBe('courseId not provided')
  })
  it('should fail when courseId provided can not be found or linked to user', async () => {
    const userId = await getUser()
    const token = getToken(userId as string)

    const response = await request(app)
      .delete('/courses')
      .send({ courseId: new ObjectId() })
      .set({ 'x-api-key': token })

    expect(response.statusCode).toBe(401)

    const error = response.body
    expect(error.message).toBe('Unauthorized')
  })
  it('should remove course', async () => {
    const userId = await getUser()
    const token = getToken(userId as string)

    const course = await Course.create({
      name: 'mock_course',
      description: 'mock_description',
      users: [userId]
    })
    const response = await request(app)
      .delete('/courses')
      .send({ courseId: course._id })
      .set({ 'x-api-key': token })

    expect(response.statusCode).toBe(200)

    const res = response.body
    expect(res._id.toString()).toBe(course._id.toString())

    const courseDeletedDb = await Course.findById(course._id)
    expect(courseDeletedDb).toBeNull()
  })
})
