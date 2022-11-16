import { connect, createUser, disconnect, getToken, getUser, resetTestData } from '../../../lib/test'
import request from 'supertest'
import { app } from '../../app'
import { ObjectId } from 'mongodb'
import { Course } from '../../models/CourseModel'
import { Module } from '../../models/ModuleModel'

describe('integration: get module', () => {
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

  it('should fail when user is not linked to module course', async () => {
    const userId = await getUser()
    const token = getToken(userId as string)

    const course = await Course.create({
      name: 'mock_course',
      description: 'mock_description',
      users: [new ObjectId(), new ObjectId()]
    })

    const module = await Module.create({
      course: course._id,
      name: 'mock_module'
    })

    const response = await request(app)
      .get(`/modules/${module._id}`)
      .set({ 'x-api-key': token })

    expect(response.statusCode).toBe(401)
    const err = response.body

    expect(err.message).toBe('Unauthorized')
  })

  it('should get module', async () => {
    const userId = await getUser()
    const token = getToken(userId as string)

    const course = await Course.create({
      name: 'mock_course',
      description: 'mock_description',
      users: [new ObjectId(), userId]
    })

    const moduleSut = await Module.create({
      course: course._id,
      name: 'mock_module'
    })
    const response = await request(app)
      .get(`/modules/${moduleSut._id}`)
      .set({ 'x-api-key': token })

    expect(response.statusCode).toBe(200)
    const module = response.body

    expect(module).toBeDefined()
    expect(module.name).toBe(moduleSut.name)
    expect(module.description).toBe(moduleSut.description)
  })
})
