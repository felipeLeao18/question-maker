import { Request, Response } from 'express'
import { moduleService } from '@services/moduleService'

/**
*  @swagger
*  /modules:
*  delete:
*    summary: Delete module
*    tags: [Module]
*    consumes:
*      - application/json
*    parameters:
*      - in: body
*        name: moduleId
*        description: module id to be removed
*    responses:
*      422:
*        description: 'moduleId not provided'
*      401:
*        description: 'Unauthorized'
*      200:
*        description: 'Module removed'
*        content:
*          application/json:
*            schema:
*              $ref: '#/definitions/Module'
*/

export const removeModule = async (req: Request & { user: string }, res: Response) => {
  const { moduleId } = req.body

  const response = await moduleService.remove(moduleId, req.user)
  return res.status(200).json(response)
}
