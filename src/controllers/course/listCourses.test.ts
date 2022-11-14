import request from 'supertest'
import { createUser, getToken, getUser } from '../../../lib/test'
import { app } from '../../app'
import prismaClient from '../../database/client'

describe('integration: list courses', () => {
  beforeAll(async () => {
    await createUser()
  })
  afterEach(() => {
    jest.clearAllMocks()
    jest.restoreAllMocks()
  })

  afterAll(async () => {
    await prismaClient.course.deleteMany()
    await prismaClient.user.deleteMany()
    await prismaClient.$disconnect()
  })

  it('should return 200 and list courses linked to user', async () => {
    const USER_DOCS = 11
    const userId = await getUser()
    const token = getToken(userId as string)

    for (let index = 0; index < USER_DOCS; index++) {
      await prismaClient.course.create({
        data: {
          name: `Course ${index} name`,
          description: 'description',
          users: { create: [{ user: { connect: { id: userId } } }] }
        }
      })
    }

    const INVALID_DOCS = 3

    const anotherUser = await prismaClient.user.create({
      data: {
        name: 'any_name',
        email: 'any_mail@mail.com',
        password: 'any_password'
      }
    })
    for (let index = 0; index < INVALID_DOCS; index++) {
      await prismaClient.course.create({
        data: {
          name: `Course ${index} name`,
          description: 'description',
          users: { create: [{ user: { connect: { id: anotherUser.id } } }] }
        }
      })
    }
    const query = {
      page: 1,
      perPage: 50
    }
    const response = await request(app).get('/courses').query(query).set({ 'x-api-key': token })
    expect(response.statusCode).toBe(200)

    const { data, from, to } = response.body
    expect(data.length).toBe(USER_DOCS)
    expect(from).toBe(1)
    expect(to).toBe(USER_DOCS)
  })
})
