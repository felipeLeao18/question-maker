
import request from 'supertest'
import { connect, createUser, disconnect, getToken, getUser, resetTestData } from '@lib/test'
import { app } from '@app'
import { Course } from '@models/CourseModel'
import { Module } from '@models/ModuleModel'

describe('integration: Create module', () => {
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

  const createCourse = async (userId: string) => {
    return await Course.create({
      name: 'mock_course',
      users: [userId]
    })
  }
  it('should return 422 when name is not provided', async () => {
    const userId = await getUser()
    const token = getToken(userId as string)

    const course = await createCourse(userId as string)
    const response = await request(app).post('/modules').send({
      courseId: course._id
    }).set({ 'x-api-key': token })

    expect(response.statusCode).toBe(422)

    const error = response.body
    expect(error.status).toBe('invalidSchemaError')
    expect(error.message[0]).toBe('name is required')
  })
  it('should return 200 and create module', async () => {
    await createUser()
    const userId = await getUser()

    const token = getToken(userId as string)

    const course = await createCourse(userId as string)

    const moduleSut = {
      name: 'my_course',
      description: 'my_course_description',
      courseId: course._id
    }
    const response = await request(app).post('/modules').send(moduleSut).set({ 'x-api-key': token })

    expect(response.statusCode).toBe(200)

    const module = response.body
    expect(module._id).toBeDefined()
    expect(module.name).toBe(moduleSut.name)
    expect(module.description).toBe(moduleSut.description)
    expect(module.course.toString()).toBe(moduleSut.courseId.toString())
    expect(module.order).toBe(1)
  })
  it('should return 200 and create module validating order', async () => {
    await createUser()
    const userId = await getUser()

    const token = getToken(userId as string)

    const course = await createCourse(userId as string)

    const moduleSut = {
      name: 'my_course',
      description: 'my_course_description',
      courseId: course._id
    }
    const response = await request(app).post('/modules').send(moduleSut).set({ 'x-api-key': token })

    expect(response.statusCode).toBe(200)

    const module = response.body
    expect(module._id).toBeDefined()
    expect(module.name).toBe(moduleSut.name)
    expect(module.description).toBe(moduleSut.description)
    expect(module.course.toString()).toBe(moduleSut.courseId.toString())
    expect(module.order).toBe(1)
  })
  it('should return 412 and fail when order provided is not in modules range', async () => {
    await createUser()
    const userId = await getUser()

    const token = getToken(userId as string)

    const course = await createCourse(userId as string)

    const moduleSut = {
      name: 'my_course',
      description: 'my_course_description',
      courseId: course._id,
      order: 3
    }
    const response = await request(app).post('/modules').send(moduleSut).set({ 'x-api-key': token })

    expect(response.statusCode).toBe(412)
  })
  it('should return 412 and fail when order provided is not in modules range', async () => {
    await createUser()
    const userId = await getUser()

    const token = getToken(userId as string)

    const course = await createCourse(userId as string)

    const moduleSut = {
      name: 'my_course',
      description: 'my_course_description',
      courseId: course._id,
      order: 0
    }
    const response = await request(app).post('/modules').send(moduleSut).set({ 'x-api-key': token })

    expect(response.statusCode).toBe(412)
  })
  it('should return 200 and create module, should update all previous created modules', async () => {
    await createUser()
    const userId = await getUser()

    const token = getToken(userId as string)

    const course = await createCourse(userId as string)

    const anotherModules: any = []
    for (let i = 0; i < 5; i++) {
      anotherModules.push({
        course: course._id,
        order: i + 1,
        name: `module ${i + 1}`
      })
    }
    await Module.insertMany(anotherModules)

    const moduleSut = {
      name: 'my_course',
      description: 'my_course_description',
      courseId: course._id,
      order: 2
    }
    const response = await request(app).post('/modules').send(moduleSut).set({ 'x-api-key': token })

    expect(response.statusCode).toBe(200)

    const module = response.body
    expect(module._id).toBeDefined()
    expect(module.name).toBe(moduleSut.name)
    expect(module.description).toBe(moduleSut.description)
    expect(module.course.toString()).toBe(moduleSut.courseId.toString())
    expect(module.order).toBe(2)

    const modules = await Module.find({ course: course._id }).sort({ order: 'asc' })
    for (let i = 0; i < modules.length; i++) {
      expect(modules[i].order).toBe(i + 1)
    }
  })
})
