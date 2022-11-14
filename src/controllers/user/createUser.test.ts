import { User } from '@prisma/client'
import request from 'supertest'
import { app } from '../../app'
import prismaClient from '../../database/client'
import { crypt } from '../../services/common/crypt'

describe('integration: Create user', () => {
  afterEach(async () => {
    await prismaClient.user.deleteMany()

    jest.clearAllMocks()
    jest.restoreAllMocks()
  })

  afterAll(async () => {
    await prismaClient.user.deleteMany()
    await prismaClient.$disconnect()
  })

  it('should return 422 when name is not provided', async () => {
    const response = await request(app).post('/users').send({
      password: 'valid_password',
      email: 'valid_mail@mail.com'
    })
    expect(response.statusCode).toBe(422)

    const error = response.body
    expect(error.status).toBe('invalidSchemaError')
    expect(error.message[0]).toBe('name is required')
  })
  it('should return 422 when email is not provided', async () => {
    const response = await request(app).post('/users').send({
      password: 'valid_password',
      name: 'valid_name'
    })
    expect(response.statusCode).toBe(422)

    const error = response.body
    expect(error.status).toBe('invalidSchemaError')
    expect(error.message[0]).toBe('email is required')
  })
  it('should return 422 when password is not provided', async () => {
    const response = await request(app).post('/users').send({
      name: 'valid_name',
      email: 'valid_mail@mail.com'
    })
    expect(response.statusCode).toBe(422)

    const error = response.body
    expect(error.status).toBe('invalidSchemaError')
    expect(error.message[0]).toBe('password is required')
  })
  it('should return 422 when name, email and password are not provided', async () => {
    const response = await request(app).post('/users').send({
    })
    expect(response.statusCode).toBe(422)

    const error = response.body
    expect(error.status).toBe('invalidSchemaError')
    expect(error.message.includes('name is required')).toBe(true)
    expect(error.message.includes('email is required')).toBe(true)
    expect(error.message.includes('password is required')).toBe(true)
  })
  it('should return 412 when email provided is invalid', async () => {
    const response = await request(app).post('/users').send({
      name: 'valid_name',
      password: 'valid_password',
      email: 'invalidMail'
    })

    expect(response.statusCode).toBe(422)

    const error = response.body
    expect(error.status).toBe('invalidSchemaError')
    expect(error.message.includes('Invalid email provided')).toBe(true)
  })
  it('should return 412 when email provided is valid and already taken', async () => {
    const user: User = {
      email: 'repeated_email@mail.com',
      name: 'valid_name',
      password: 'valid_password',
      id: '1',
      created_at: new Date(),
      updated_at: new Date()
    }

    jest.spyOn(prismaClient.user, 'findFirst').mockResolvedValue(user)

    const response = await request(app).post('/users').send({
      name: 'valid_name',
      password: 'valid_password',
      email: 'repeated_email@mail.com'
    })

    expect(response.statusCode).toBe(412)

    const error = response.body
    expect(error.status).toBe('error')
    expect(error.message).toBe('Email already taken')
  })
  it('should return 422 when password length is less than 6', async () => {
    const response = await request(app).post('/users').send({
      name: 'valid_name',
      password: 'ab',
      email: 'valid_mail@mail.com'
    })
    expect(response.statusCode).toBe(422)

    const error = response.body
    expect(error.status).toBe('invalidSchemaError')
    expect(error.message[0]).toBe('password must have at least 6 characters')
  })
  it('should return 200 and create user', async () => {
    const createUserSut = {
      email: 'valid_email@mail.com',
      password: crypt.createHash('valid_password'),
      name: 'valid_name'
    }
    const response = await request(app).post('/users').send(createUserSut)

    expect(response.statusCode).toBe(201)

    const { success } = response.body
    expect(success).toBe(true)

    const user = await prismaClient.user.findFirst({ where: { email: createUserSut.email } })

    expect(user).not.toBeNull()
    expect(user?.id).toBeDefined()
    expect(user?.created_at).toBeDefined()
    expect(user?.updated_at).toBeDefined()
    expect(user?.password).toBeDefined()

    expect(user?.email).toBe(createUserSut.email)
    expect(user?.password).not.toBe(createUserSut.password)
  })
})
