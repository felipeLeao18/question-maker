import { Request, Response } from 'express'
import { moduleService } from '@services/moduleService'

/**
*  @swagger
*  /modules:
*  post:
*    summary: Create module
*    tags: [Module]
*    consumes:
*      - application/json
*    parameters:
*      - in: body
*        name: module
*        description: Create module
*        schema:
*          type: object
*          required:
*            - name
*          properties:
*            name:
*              type: string
*            description:
*              type: string
*            courseId:
*              type: string
*    responses:
*      422:
*        description: 'Invalid schema'
*      200:
*        description: 'module created'
*        content:
*          application/json:
*            schema:
*              $ref: '#/definitions/Module'
*/

export const createModule = async (req: Request & { user: string }, res: Response) => {
  const { order, name, description, courseId } = req.body

  const response = await moduleService.create({ name, description, order }, courseId, req.user)
  return res.status(200).json(response)
}
