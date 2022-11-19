
import { courseService } from '@services/courseService'
import { Request, Response } from 'express'

/**
*  @swagger
*  /courses:
*  post:
*    summary: Create course
*    tags: [Course]
*    consumes:
*      - application/json
*    parameters:
*      - in: body
*        name: course
*        description: Create course
*        schema:
*          type: object
*          required:
*            - name
*          properties:
*            name:
*              type: string
*            description:
*              type: string
*    responses:
*      422:
*        description: 'Invalid schema'
*      200:
*        description: 'Course created'
*        content:
*          application/json:
*            schema:
*              $ref: '#/definitions/Course'
*/

export const createCourse = async (req: Request & { user: string }, res: Response) => {
  const { name, description } = req.body

  const response = await courseService.create({ name, description }, req.user)
  return res.status(200).json(response)
}
