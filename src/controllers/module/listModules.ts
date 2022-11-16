import { Request, Response } from 'express'
import { moduleService } from '@services/moduleService'

/**
*  @swagger
*  /modules:
*  get:
*    summary: list course modules
*    tags: [Module]
*    consumes:
*      - application/json
*    parameters:
*      - in: query
*        name: filter
*        description: or filter to contains on name or description
*          required:
*            - courseId
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
*        description: 'course modules list'
*        schema:
*          $ref: '#/definitions/Module'
*/

export const listModules = async (req: Request & { user: string }, res: Response) => {
  const { filter, page, perPage, courseId } = req.query

  const response = await moduleService.list({
    filter: filter?.toString() ?? undefined,
    page: page ? parseInt(page.toString()) : undefined,
    perPage: perPage ? parseInt(perPage.toString()) : undefined
  },
  courseId?.toString() ?? '',
  req.user)
  return res.status(200).json(response)
}
