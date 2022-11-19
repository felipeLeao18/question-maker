import request from 'supertest'
import { connect, createUser, disconnect, getToken, getUser, resetTestData } from '@lib/test'
import { app } from '@app'
import { Course } from '@models/CourseModel'
import { ObjectId } from 'mongodb'
import { Module } from '@models/ModuleModel'
import { Lesson } from '@models/LessonModel'

describe('integration: list module lessons', () => {
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

  it('should return 200 and list module lessons', async () => {
    const USER_DOCS = 11
    const userId = await getUser()
    const token = getToken(userId as string)

    const validCourse = await Course.create({
      name: 'valid_course',
      users: [userId]
    })
    const validModule = await Module.create({
      name: 'valid_course',
      course: validCourse._id
    })
    for (let index = 0; index < USER_DOCS; index++) {
      await Lesson.create({
        name: `Module ${index} name`,
        description: 'description',
        module: validModule._id
      })
    }

    const INVALID_DOCS = 3

    const invalidCourse = await Course.create({
      name: 'invalid_course',
      description: 'description',
      users: [new ObjectId()]
    })

    const invalidModule = await Module.create({
      name: 'Invalid module name',
      description: 'description',
      course: invalidCourse._id
    })

    for (let index = 0; index < INVALID_DOCS; index++) {
      await Lesson.create({
        name: `Invalid lesson ${index} name`,
        description: 'description',
        module: invalidModule._id
      })
    }
    const query = {
      page: 1,
      perPage: 50,
      moduleId: validModule._id.toString()
    }

    const response = await request(app).get('/lessons').query(query).set({ 'x-api-key': token })
    expect(response.statusCode).toBe(200)

    const { data, from, to, totalSize } = response.body
    expect(data.length).toBe(USER_DOCS)
    expect(from).toBe(1)
    expect(to).toBe(USER_DOCS)
    expect(totalSize).toBe(USER_DOCS)
  })
})
