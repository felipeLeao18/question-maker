import request from 'supertest'
import { connect, createUser, disconnect, getToken, getUser, resetTestData } from '@lib/test'
import { app } from '@app'
import { QuestionTypesEnum } from '@/types/QuestionTypesEnum'
import { ObjectId } from 'mongodb'

describe('integration: Create question', () => {
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
})
