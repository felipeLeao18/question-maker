import { Request, Response } from 'express'
import { lessonService } from '@services/lessonService'

/**
*  @swagger
*  /lessons:
*  get:
*    summary: list module lessons
*    tags: [Lesson]
*    consumes:
*      - application/json
*    parameters:
*      - in: query
*        name: filter
*        description: or filter to contains on name or description
*          required:
*            - moduleId
*        schema:
*          type: object
*          properties:
*            filter:
*              type: string
*            page:
*              type: number
*            perPage:
*              type: number
*    responses:
*      422:
*        description: 'Invalid schema'
*      200:
*        description: 'lessons list'
*        schema:
*          $ref: '#/definitions/Lesson'
*/

export const listLessons = async (req: Request & { user: string }, res: Response) => {
  const { filter, page, perPage, moduleId } = req.query

  const response = await lessonService.list({
    filter: filter?.toString() ?? undefined,
    page: page ? parseInt(page.toString()) : undefined,
    perPage: perPage ? parseInt(perPage.toString()) : undefined
  },
  moduleId?.toString() ?? '',
  req.user)
  return res.status(200).json(response)
}
