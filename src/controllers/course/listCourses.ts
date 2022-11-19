
import { Request, Response } from 'express'
import { courseService } from '@services/courseService'

/**
*  @swagger
*  /courses:
*  get:
*    summary: list courses
*    tags: [Course]
*    consumes:
*      - application/json
*    parameters:
*      - in: query
*        name: filter
*        description: 'or filter to contains on name or description'
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
*        description: 'courses list'
*        content:
*          application/json:
*            schema:
*              $ref: '#/definitions/Course'
*/

export const listCourses = async (req: Request & { user: string }, res: Response) => {
  const { filter, page, perPage } = req.query

  const response = await courseService.list({
    filter: filter?.toString() ?? undefined,
    page: page ? parseInt(page.toString()) : undefined,
    perPage: perPage ? parseInt(perPage.toString()) : undefined
  },
  req.user)
  return res.status(200).json(response)
}
