import { QuestionTypesEnum } from './QuestionTypesEnum'

/**
 * @swagger
 * definitions:
 *     Question:
 *       properties:
 *         _id:
 *           type: string
 *         body:
 *           type: string
 *         value:
 *           type: number
 *         order:
 *           type: number
 *         module:
 *           type: string
 *         lesson:
 *           type: string
 *         type:
 *           type: string
 *           enum: ['ESSAY', 'TRUE_OR_FALSE', 'MULTIPLE_CHOICE']
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         options:
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
