
import { Request, Response } from 'express'
import { lessonService } from '@services/lessonService'

/**
*  @swagger
*  /lessons:
*  post:
*    summary: Create lesson
*    tags: [Lesson]
*    consumes:
*      - application/json
*    parameters:
*      - in: body
*        name: Lesson
*        description: Create lesson
*        schema:
*          type: object
*          required:
*            - name
*          properties:
*            name:
*              type: string
*            description:
*              type: string
*            moduleId:
*              type: string
*    responses:
*      422:
*        description: 'Invalid schema'
*      200:
*        description: 'Lesson created'
*        schema:
*          $ref: '#/definitions/Lesson'
*/

export const createLesson = async (req: Request & { user: string }, res: Response) => {
  const { order, name, description, moduleId } = req.body

  const response = await lessonService.create({ name, description, order }, moduleId, req.user)
  return res.status(200).json(response)
}
