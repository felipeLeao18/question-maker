import { QuestionTypesEnum } from './QuestionTypesEnum'

/**
 * @swagger
 * definitions:
 *     Question:
 *       properties:
 *         body:
 *           type: string
 *         value:
 *           type: number
 *         type:
 *           type: objectid
 *         order:
 *           type: number
 *       type: object
 *      options:
 *          type: array
 *          items:
 *            type: object
 *            properties:
 *              body:
 *                type: string
 *              correct:
 *                type: boolean
 *              comment:
 *                type: string
 *      type:
 *           type: string
 *           schema:
 *            $ref: '#/components/schemas/QuestionTypesEnum'
 *       required:
 *         - body
 *         - type
 */

export interface IQuestion {
  body: string
  value?: number
  type: QuestionTypesEnum
  module?: string
  lesson?: string
  order: number
  options: [{
    body: string
    correct: boolean
    comment: string
  }]
}
