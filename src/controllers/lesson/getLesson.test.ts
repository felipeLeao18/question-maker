
import { connect, createUser, disconnect, getToken, getUser, resetTestData } from '@lib/test'
import request from 'supertest'
import { app } from '@app'
import { ObjectId } from 'mongodb'
import { Course } from '@models/CourseModel'
import { Module } from '@models/ModuleModel'
import { Lesson } from '@models/LessonModel'

describe('integration: get lesson', () => {
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

  it('should fail when user is not linked to lesson module course', async () => {
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

    const lesson = await Lesson.create({
      module: module._id,
      name: 'mock'
    })

    const response = await request(app)
      .get(`/lessons/${lesson._id}`)
      .set({ 'x-api-key': token })

    expect(response.statusCode).toBe(401)
    const err = response.body

    expect(err.message).toBe('Unauthorized')
  })

  it('should get lesson', async () => {
    const userId = await getUser()
    const token = getToken(userId as string)

    const course = await Course.create({
      name: 'mock_course',
      description: 'mock_description',
      users: [new ObjectId(), userId]
    })

    const module = await Module.create({
      course: course._id,
      name: 'mock_module'
    })

    const lessonSut = await Lesson.create({
      name: 'mock_lesson',
      module: module._id,
      description: 'mock_lesson description'
    })
    const response = await request(app)
      .get(`/lessons/${lessonSut._id}`)
      .set({ 'x-api-key': token })

    expect(response.statusCode).toBe(200)
    const lesson = response.body

    expect(lesson).toBeDefined()
    expect(lesson.name).toBe(lessonSut.name)
    expect(lesson.description).toBe(lessonSut.description)

    expect(lesson.module._id).toBe(module._id.toString())
  })
})
