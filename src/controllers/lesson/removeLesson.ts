
import { Request, Response } from 'express'
import { lessonService } from '@services/lessonService'

/**
*  @swagger
*  /lessons:
*  delete:
*    summary: Delete lesson
*    tags: [Lesson]
*    consumes:
*      - application/json
*    parameters:
*      - in: body
*        name: lessonId
*        description: lesson id to be removed
*    responses:
*      422:
*        description: 'lessonId not provided'
*      401:
*        description: 'Unauthorized'
*      200:
*        description: 'lesson removed'
*        content:
*          application/json:
*            schema:
*              $ref: '#/definitions/Lesson'
*/

export const removeLesson = async (req: Request & { user: string }, res: Response) => {
  const { lessonId } = req.body

  const response = await lessonService.remove(lessonId, req.user)
  return res.status(200).json(response)
}
