

import { connect, createUser, disconnect, getToken, getUser, resetTestData } from '@lib/test'
import request from 'supertest'
import { app } from '@app'
import { ObjectId } from 'mongodb'
import { Course } from '@models/CourseModel'
import { Module } from '@models/ModuleModel'
import { Lesson } from '@models/LessonModel'

describe('integration: remove lesson', () => {
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
  it('should fail when lessonId is not provided', async () => {
    const userId = await getUser()
    const token = getToken(userId as string)

    const response = await request(app)
      .delete('/lessons')
      .send({ lessonId: '' })
      .set({ 'x-api-key': token })

    expect(response.statusCode).toBe(422)

    const error = response.body
    expect(error.message).toBe('lessonId not provided')
  })
  it('should fail when lesson provided can not be found or is not linked to some user course module', async () => {
    const userId = await getUser()
    const token = getToken(userId as string)

    const response = await request(app)
      .delete('/lessons')
      .send({ lessonId: new ObjectId() })
      .set({ 'x-api-key': token })

    expect(response.statusCode).toBe(401)

    const error = response.body
    expect(error.message).toBe('Unauthorized')
  })
  it('should remove module but maintain lessons order', async () => {
    const userId = await getUser()
    const token = getToken(userId as string)

    const course = await Course.create({
      name: 'mock_course',
      description: 'mock_description',
      users: [userId]
    })
    const module = await Module.create({
      course: course._id,
      name: 'module_mock'
    })

    const lessons: any = []
    for (let i = 0; i < 5; i++) {
      lessons.push({
        module: module._id,
        order: i + 1,
        name: `lesson ${i + 1}`
      })
    }

    await Lesson.insertMany(lessons)

    const lessonToDelete = await Lesson.findOne({ order: 3, module: module._id }).select('_id')
    const response = await request(app)
      .delete('/lessons')
      .send({ lessonId: lessonToDelete?._id })
      .set({ 'x-api-key': token })

    expect(response.statusCode).toBe(200)

    const res = response.body
    expect(res._id.toString()).toBe(lessonToDelete?._id.toString())

    const lessonRemovedDb = await Lesson.findById(lessonToDelete?._id)
    expect(lessonRemovedDb).toBeNull()

    const lessonsUpdated = await Lesson.find({ module: module._id }).sort({ order: 'asc' })

    for (let i = 0; i < lessonsUpdated.length; i++) {
      expect(lessonsUpdated[i].order).toBe(i + 1)
    }
  })
})
