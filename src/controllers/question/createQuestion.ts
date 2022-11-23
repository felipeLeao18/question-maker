import { Request, Response } from 'express'
import { questionService } from '@services/questionService'

/**
*  @swagger
*  /questions:
*  post:
*    summary: Create question
*    tags: [Question]
*    consumes:
*      - application/json
*    parameters:
*      - in: body
*        name: question
*        description: Create Question
*        schema:
*          type: object
*          required:
*            - body
*            - lesson
*            - module
*          properties:
*            _id:
*              type: string
*            body:
*              type: string
*            value:
*              type: number
*            order:
*              type: number
*            type:
*              type: string
*              enum: ['ESSAY', 'TRUE_OR_FALSE', 'MULTIPLE_CHOICE']
*            createdAt:
*              type: string
*              format: date-time
*            updatedAt:
*              type: string
*              format: date-time
*            options:
*             type: array
*             items:
*               type: object
*               properties:
*                 body:
*                   type: string
*                 correct:
*                   type: boolean
*                 comment:
*                   type: string
*    responses:
*      422:
*        description: 'Invalid schema'
*      200:
*        description: 'questionCreated'
*        content:
*          application/json:
*            schema:
*              $ref: '#/definitions/Question'
*/

export const createQuestion = async (req: Request & { user: string }, res: Response) => {
  const response = await questionService.create(req.body, req.user)
  return res.status(200).json(response)
}
