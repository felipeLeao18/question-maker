/**
 * @swagger
 * definitions:
 *     Lesson:
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         module:
 *           type: string
 *         order:
 *           type: number
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       required:
 *         - name
 *       type: object
 */
export interface ILesson {
  name: string
  description: string
  order: number
  module: string
}
