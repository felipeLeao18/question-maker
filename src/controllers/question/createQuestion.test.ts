import request from 'supertest'
import { connect, createUser, disconnect, getToken, getUser, resetTestData } from '@lib/test'
import { app } from '@app'
import { QuestionTypesEnum } from '@/types/QuestionTypesEnum'
import { ObjectId } from 'mongodb'
import { Module } from '@models/ModuleModel'
import { Course } from '@models/CourseModel'

describe('integration: Create question', () => {
  beforeAll(async () => {
    await connect(__filename)
    await createUser()
  })

  afterEach(async () => {
    await resetTestData()
    jest.clearAllMocks()
    jest.restoreAllMocks()
    await createUser()
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
  it('should return 422 when question body is not provided', async () => {
    const userId = await getUser()
    const token = getToken(userId as string)

    const response = await request(app).post('/questions').send({
    }).set({ 'x-api-key': token })

    expect(response.statusCode).toBe(422)

    const error = response.body
    expect(error.status).toBe('invalidSchemaError')
    expect(error.message[0]).toBe('body is required')
  })
  it('should return 422 when question type is not provided', async () => {
    const userId = await getUser()
    const token = getToken(userId as string)

    const body = {
      body: 'Question body'
    }
    const response = await request(app).post('/questions').send(body)
      .set({ 'x-api-key': token })

    expect(response.statusCode).toBe(422)

    const error = response.body
    expect(error.status).toBe('invalidSchemaError')
    expect(error.message[0]).toBe('type is required')
  })
  it('should return 422 when question type provided is invalid', async () => {
    const userId = await getUser()
    const token = getToken(userId as string)

    const body = {
      body: 'Question body',
      type: 'any'
    }
    const response = await request(app).post('/questions').send(body)
      .set({ 'x-api-key': token })

    expect(response.statusCode).toBe(422)

    const error = response.body
    expect(error.status).toBe('invalidSchemaError')
    expect(error.message[0]).toContain('Invalid enum value')
  })
  it('should return 422 when question module or lesson are not provided', async () => {
    const userId = await getUser()
    const token = getToken(userId as string)

    const body = {
      body: 'Question body',
      type: QuestionTypesEnum.ESSAY
    }
    const response = await request(app).post('/questions').send(body)
      .set({ 'x-api-key': token })

    expect(response.statusCode).toBe(422)

    const error = response.body
    expect(error.status).toBe('invalidSchemaError')
    expect(error.message[0]).toBe('lesson or module must be provided')
  })
  it('should return 422 when question module and lesson are provided', async () => {
    const userId = await getUser()
    const token = getToken(userId as string)

    const body = {
      body: 'Question body',
      type: QuestionTypesEnum.ESSAY,
      module: new ObjectId(),
      lesson: new ObjectId()
    }
    const response = await request(app).post('/questions').send(body)
      .set({ 'x-api-key': token })

    expect(response.statusCode).toBe(422)

    const error = response.body
    expect(error.status).toBe('invalidSchemaError')
    expect(error.message[0]).toBe('question must be linked only to lesson or module')
  })
  it('should return 401 and unauthorized when module provided is not linked to any user course', async () => {
    const userId = await getUser()
    const token = getToken(userId as string)

    const body = {
      body: 'Question body',
      type: QuestionTypesEnum.ESSAY,
      module: new ObjectId()
    }
    const response = await request(app).post('/questions').send(body)
      .set({ 'x-api-key': token })

    expect(response.statusCode).toBe(401)

    const error = response.body
    expect(error.message).toBe('Unauthorized')
  })
  it('should return 401 and unauthorized when lesson provided is not linked to any user course', async () => {
    const userId = await getUser()
    const token = getToken(userId as string)

    const body = {
      body: 'Question body',
      type: QuestionTypesEnum.ESSAY,
      lesson: new ObjectId()
    }
    const response = await request(app).post('/questions').send(body)
      .set({ 'x-api-key': token })

    expect(response.statusCode).toBe(401)

    const error = response.body
    expect(error.message).toBe('Unauthorized')
  })
  it('should return 401 and unauthorized when lesson provided is not linked to any user course', async () => {
    const userId = await getUser()
    const token = getToken(userId as string)

    const body = {
      body: 'Question body',
      type: QuestionTypesEnum.ESSAY,
      lesson: new ObjectId()
    }
    const response = await request(app).post('/questions').send(body)
      .set({ 'x-api-key': token })

    expect(response.statusCode).toBe(401)

    const error = response.body
    expect(error.message).toBe('Unauthorized')
  })
  it('should return 200 and create question', async () => {
    const userId = await getUser()
    const token = getToken(userId as string)
    const course = await createCourse(userId as string)

    const module = await Module.create({
      name: 'mock_name',
      course: course._id
    })
    const body = {
      body: 'How much is 10 + 10?',
      type: QuestionTypesEnum.MULTIPLE_CHOICE,
      module: module._id,
      options: [
        { body: '150', correct: false, comment: 'not the correct' },
        { body: '20', correct: true, comment: 'congrats' },
        { body: '30', correct: false, comment: 'Really?' },
        { body: 'none of the above', correct: false, comment: 'letter b is correct' }
      ]
    }
    const response = await request(app).post('/questions').send(body)
      .set({ 'x-api-key': token })

    const question = response.body

    expect(question.body).toBe(body.body)
    expect(question.type).toBe(body.type)
    expect(question.module).toBe(module._id.toString())
    expect(question.options.map(({ _id, ...option }) => option)).toStrictEqual(body.options)
  })
})
