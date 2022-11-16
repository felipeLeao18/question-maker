import request from 'supertest'
import { connect, createUser, disconnect, getToken, getUser, resetTestData } from '../../../lib/test'
import { app } from '../../app'
import { Course } from '../../models/CourseModel'
import { ObjectId } from 'mongodb'

describe('integration: list courses', () => {
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

  it('should return 200 and list courses linked to user', async () => {
    const USER_DOCS = 11
    const userId = await getUser()
    const token = getToken(userId as string)

    for (let index = 0; index < USER_DOCS; index++) {
      await Course.create({
        name: `Course ${index} name`,
        description: 'description',
        users: [userId]
      })
    }

    const INVALID_DOCS = 3

    for (let index = 0; index < INVALID_DOCS; index++) {
      await Course.create({
        name: `Course ${index} name`,
        description: 'description',
        users: [new ObjectId()]
      })
    }
    const query = {
      page: 1,
      perPage: 50
    }
    const response = await request(app).get('/courses').query(query).set({ 'x-api-key': token })
    expect(response.statusCode).toBe(200)

    const { data, from, to, totalSize } = response.body
    expect(data.length).toBe(USER_DOCS)
    expect(from).toBe(1)
    expect(to).toBe(USER_DOCS)
    expect(totalSize).toBe(USER_DOCS)
  })
})
