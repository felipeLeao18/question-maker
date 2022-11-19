import { Request, Response } from 'express'
import { lessonService } from '@services/lessonService'

/**
*  @swagger
*  /lessons/lessonId:
*  get:
*    summary: get lesson
*    tags: [Lesson]
*    consumes:
*      - application/json
*    parameters:
*      - in: params
*        name: lessonId
*        description: lesson id to be found
*    responses:
*      401:
*        description: 'Unauthorized'
*      200:
*        description: 'lesson found'
*        content:
*          application/json:
*            schema:
*              $ref: '#/definitions/Lesson'
*/

export const getLesson = async (req: Request & { user: string }, res: Response) => {
  const { lessonId } = req.params

  const response = await lessonService.findById(lessonId ? lessonId.toString() : '', req.user)
  return res.status(200).json(response)
}
