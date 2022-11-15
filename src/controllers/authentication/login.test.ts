import request from 'supertest'
import { connect, disconnect, resetTestData } from '../../../lib/test'
import { app } from '../../app'
import { User } from '../../models/UserModel'
import { crypt } from '../../services/common/crypt'

describe('integration: login', () => {
  beforeAll(async () => {
    await connect(__filename)
  })

  afterEach(async () => {
    await resetTestData()
    jest.clearAllMocks()
    jest.restoreAllMocks()
  })

  afterAll(async () => {
    await disconnect(__filename)
  })

  it('should return 422 when password is not provided', async () => {
    const response = await request(app).post('/auth').send({
      name: 'valid_name',
      email: 'valid_mail@mail.com'
    })
    expect(response.statusCode).toBe(422)

    const error = response.body
    expect(error.status).toBe('invalidSchemaError')
    expect(error.message[0]).toBe('password is required')
  })
  it('should return 422 when email and password are not provided', async () => {
    const response = await request(app).post('/auth').send({
    })
    expect(response.statusCode).toBe(422)

    const error = response.body
    expect(error.status).toBe('invalidSchemaError')

    expect(error.message.includes('email is required')).toBe(true)
    expect(error.message.includes('password is required')).toBe(true)
  })
  it('should return 412 when email provided is invalid', async () => {
    const response = await request(app).post('/auth').send({
      name: 'valid_name',
      password: 'valid_password',
      email: 'invalidMail'
    })

    expect(response.statusCode).toBe(422)

    const error = response.body
    expect(error.status).toBe('invalidSchemaError')
    expect(error.message.includes('Invalid email provided')).toBe(true)
  })
  it('should return 422 when password length is less than 6', async () => {
    const response = await request(app).post('/auth').send({
      name: 'valid_name',
      password: 'ab',
      email: 'valid_mail@mail.com'
    })
    expect(response.statusCode).toBe(422)

    const error = response.body
    expect(error.status).toBe('invalidSchemaError')
    expect(error.message[0]).toBe('password must have at least 6 characters')
  })
  it('should return 401 when valid email and password are provided but user can not be found', async () => {
    const response = await request(app).post('/auth').send({
      password: 'valid_password',
      email: 'valid_mail@mail.com'
    })
    expect(response.statusCode).toBe(401)

    const error = response.body

    expect(error.message).toBe('Email or password is invalid')
    expect(error.status).toBe('error')
  })
  it('should return 200 and login user', async () => {
    const createUserSut = {
      email: 'valid_email@mail.com',
      password: 'valid_password',
      name: 'valid_name'
    }
    await User.create({ ...createUserSut, password: crypt.createHash(createUserSut.password) })

    const response = await request(app).post('/auth').send({
      email: createUserSut.email,
      password: createUserSut.password
    })

    const { success, token } = response.body
    expect(success).toBe(true)
    expect(token).toBeDefined()
  })
})
