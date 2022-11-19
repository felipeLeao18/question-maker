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
 *         type:
 *           type: string
 *           enum: *TYPES
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
