import { Request, Response } from 'express'
import { moduleService } from '@services/moduleService'

/**
*  @swagger
*  /modules/moduleId:
*  get:
*    summary: get module
*    tags: [Module]
*    consumes:
*      - application/json
*    parameters:
*      - in: params
*        name: moduleId
*        description: module id to be found
*    responses:
*      401:
*        description: 'Unauthorized'
*      200:
*        description: 'module found'
*        schema:
*          $ref: '#/definitions/Module'
*/

export const getModule = async (req: Request & { user: string }, res: Response) => {
  const { moduleId } = req.params

  const response = await moduleService.findById(moduleId ? moduleId.toString() : '', req.user)
  return res.status(200).json(response)
}
