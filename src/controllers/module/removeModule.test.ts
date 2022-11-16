
import { connect, createUser, disconnect, getToken, getUser, resetTestData } from '../../../lib/test'
import request from 'supertest'
import { app } from '../../app'
import { ObjectId } from 'mongodb'
import { Course } from '../../models/CourseModel'
import { Module } from '../../models/ModuleModel'

describe('integration: remove module', () => {
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
  it('should fail when moduleId is not provided', async () => {
    const userId = await getUser()
    const token = getToken(userId as string)

    const response = await request(app)
      .delete('/modules')
      .send({ moduleId: '' })
      .set({ 'x-api-key': token })

    expect(response.statusCode).toBe(422)

    const error = response.body
    expect(error.message).toBe('moduleId not provided')
  })
  it('should fail when moduleId provided can not be found or is not linked to some user course', async () => {
    const userId = await getUser()
    const token = getToken(userId as string)

    const response = await request(app)
      .delete('/modules')
      .send({ moduleId: new ObjectId() })
      .set({ 'x-api-key': token })

    expect(response.statusCode).toBe(401)

    const error = response.body
    expect(error.message).toBe('Unauthorized')
  })
  it('should remove module', async () => {
    const userId = await getUser()
    const token = getToken(userId as string)

    const course = await Course.create({
      name: 'mock_course',
      description: 'mock_description',
      users: [userId]
    })

    const module = await Module.create({
      name: 'mock_module',
      course: course._id
    })
    const response = await request(app)
      .delete('/modules')
      .send({ moduleId: module._id })
      .set({ 'x-api-key': token })

    expect(response.statusCode).toBe(200)

    const res = response.body
    expect(res._id.toString()).toBe(module._id.toString())

    const moduleRemovedDb = await Module.findById(course._id)
    expect(moduleRemovedDb).toBeNull()
  })
})
